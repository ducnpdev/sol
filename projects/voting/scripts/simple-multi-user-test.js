const { ethers } = require("hardhat");

async function main() {
  console.log("=== Simple Multi-User Voting Test ===\n");

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
    
    // Create a new poll
    console.log("\n🗳️  Creating a new poll for testing...");
    
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    
    const pollTitle = "Simple Multi-User Test";
    const pollDescription = "Testing multi-user voting functionality";
    const startTime = currentTime + 60; // Start in 1 minute
    const endTime = currentTime + 7200; // End in 2 hours
    const options = ["Red", "Blue", "Green"];
    
    console.log("Title:", pollTitle);
    console.log("Options:", options.join(", "));
    console.log("Start time:", new Date(startTime * 1000).toLocaleString());
    console.log("End time:", new Date(endTime * 1000).toLocaleString());
    
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
      const pollId = Number(pollCount);
      console.log("Poll ID:", pollId);
      
    } catch (error) {
      console.log("❌ Error creating poll:", error.message);
      return;
    }
    
    // Get poll info
    const pollCount = await votingContract.pollCount();
    const pollId = Number(pollCount);
    const pollInfo = await votingContract.getPollInfo(pollId);
    
    console.log(`\n📊 Poll Information:`);
    console.log(`Title: ${pollInfo.title}`);
    console.log(`Options: ${pollInfo.options.join(", ")}`);
    console.log(`Current votes: [${pollInfo.voteCounts.map(v => v.toString()).join(", ")}]`);
    
    // Test voting with multiple users
    const users = [user1, user2, user3];
    const votingOptions = [0, 1, 0]; // Different voting options
    
    console.log("\n🗳️  Testing voting with multiple users:");
    console.log("=====================================");
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const option = votingOptions[i];
      
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
    
    // Find winning option
    let maxVotes = 0;
    let winningOption = 0;
    for (let i = 0; i < finalInfo.voteCounts.length; i++) {
      if (finalInfo.voteCounts[i] > maxVotes) {
        maxVotes = finalInfo.voteCounts[i];
        winningOption = i;
      }
    }
    
    console.log(`\n🏆 Current winning option: ${finalInfo.options[winningOption]} (${maxVotes} votes)`);
    
    console.log("\n✅ Multi-user voting test completed!");
    
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
