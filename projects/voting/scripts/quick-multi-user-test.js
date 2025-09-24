const { ethers } = require("hardhat");

async function main() {
  console.log("=== Quick Multi-User Voting Test ===\n");

  try {
    // Get multiple signers (accounts)
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const contractAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("📋 Testing with accounts:");
    console.log("Owner:", owner.address.slice(0, 6) + "..." + owner.address.slice(-4));
    console.log("User 1:", user1.address.slice(0, 6) + "..." + user1.address.slice(-4));
    console.log("User 2:", user2.address.slice(0, 6) + "..." + user2.address.slice(-4));
    console.log("User 3:", user3.address.slice(0, 6) + "..." + user3.address.slice(-4));
    
    // Get active polls
    console.log("\n🔍 Finding active polls...");
    let activePolls = await votingContract.getActivePolls();
    
    let pollId;
    
    if (activePolls.length === 0) {
      console.log("❌ No active polls found. Creating a new poll...");
      
      // Get current block timestamp
      const currentBlock = await ethers.provider.getBlock("latest");
      const currentTime = currentBlock.timestamp;
      
      // Create a new poll that starts in 1 minute
      const pollTitle = "Quick Multi-User Test Poll";
      const pollDescription = "This poll is created automatically for testing multi-user voting";
      const startTime = currentTime + 60; // Start in 1 minute
      const endTime = currentTime + 3600; // End in 1 hour
      const options = ["Option A", "Option B", "Option C"];
      
      console.log("Creating poll:", pollTitle);
      console.log("Options:", options.join(", "));
      
      try {
        const tx = await votingContract.createPoll(
          pollTitle,
          pollDescription,
          startTime,
          endTime,
          options
        );
        await tx.wait();
        console.log("✅ Poll created successfully!");
        
        // Get the new poll ID
        const pollCount = await votingContract.pollCount();
        pollId = Number(pollCount);
        console.log("New poll ID:", pollId);
        
      } catch (error) {
        console.log("❌ Error creating poll:", error.message);
        return;
      }
      
    } else {
      pollId = Number(activePolls[0]);
      console.log(`✅ Found active poll ID: ${pollId}`);
    }
    
    // Get poll info
    const pollInfo = await votingContract.getPollInfo(pollId);
    console.log(`\n📊 Poll: ${pollInfo.title}`);
    console.log(`Options: ${pollInfo.options.join(", ")}`);
    console.log(`Current votes: [${pollInfo.voteCounts.map(v => v.toString()).join(", ")}]`);
    
    // Test voting with multiple users
    const users = [user1, user2, user3];
    const options = [0, 1, 0]; // Different voting options
    
    console.log("\n🗳️  Testing voting with multiple users:");
    console.log("=====================================");
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const option = options[i];
      
      console.log(`\n👤 User ${i + 1} voting for "${pollInfo.options[option]}"...`);
      
      try {
        // Check if already voted
        const hasVoted = await votingContract.hasVoted(pollId, user.address);
        if (hasVoted) {
          console.log("   ❌ Already voted");
          continue;
        }
        
        // Vote
        const userContract = votingContract.connect(user);
        const tx = await userContract.vote(pollId, option);
        await tx.wait();
        console.log("   ✅ Vote successful!");
        
        // Show updated counts
        const updatedInfo = await votingContract.getPollInfo(pollId);
        console.log(`   📊 New counts: [${updatedInfo.voteCounts.map(v => v.toString()).join(", ")}]`);
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Final result
    console.log("\n📊 Final Results:");
    console.log("=================");
    const finalInfo = await votingContract.getPollInfo(pollId);
    console.log(`Total votes: ${finalInfo.totalVotes.toString()}`);
    
    for (let i = 0; i < finalInfo.options.length; i++) {
      console.log(`${finalInfo.options[i]}: ${finalInfo.voteCounts[i].toString()} votes`);
    }
    
    console.log("\n✅ Multi-user test completed!");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
