const { ethers } = require("hardhat");

async function main() {
  console.log("=== Quick Multi-User Voting Test ===\n");

  try {
    // Get multiple signers (accounts)
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("📋 Testing with accounts:");
    console.log("Owner:", owner.address.slice(0, 6) + "..." + owner.address.slice(-4));
    console.log("User 1:", user1.address.slice(0, 6) + "..." + user1.address.slice(-4));
    console.log("User 2:", user2.address.slice(0, 6) + "..." + user2.address.slice(-4));
    console.log("User 3:", user3.address.slice(0, 6) + "..." + user3.address.slice(-4));
    
    // Get active polls
    console.log("\n🔍 Finding active polls...");
    const activePolls = await votingContract.getActivePolls();
    
    if (activePolls.length === 0) {
      console.log("❌ No active polls found. Please create a poll first.");
      return;
    }
    
    const pollId = activePolls[0].toNumber();
    console.log(`✅ Found active poll ID: ${pollId}`);
    
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
