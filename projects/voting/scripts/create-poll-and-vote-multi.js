const { ethers } = require("hardhat");

async function main() {
  console.log("=== Create Poll and Immediate Multi-User Voting ===\n");

  try {
    // Get multiple signers (accounts)
    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("📋 Account Information:");
    console.log("Owner address:", owner.address);
    console.log("User 1 address:", user1.address);
    console.log("User 2 address:", user2.address);
    console.log("User 3 address:", user3.address);
    console.log("User 4 address:", user4.address);
    console.log("User 5 address:", user5.address);
    console.log("Contract address:", contractAddress);
    
    // Get current block timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("\n⏰ Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Create a new poll that starts immediately
    console.log("\n🗳️  Creating New Poll (Starts Immediately):");
    console.log("=============================================");
    
    const pollTitle = "Instant Multi-User Test Poll";
    const pollDescription = "This poll starts immediately for testing multi-user voting";
    const startTime = currentTime; // Start immediately
    const endTime = currentTime + 7200; // End in 2 hours
    const options = ["Red", "Blue", "Green"];
    
    console.log("Title:", pollTitle);
    console.log("Description:", pollDescription);
    console.log("Start time:", new Date(startTime * 1000).toLocaleString());
    console.log("End time:", new Date(endTime * 1000).toLocaleString());
    console.log("Options:", options);
    
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
      const newPollId = pollCount.toNumber();
      console.log("New poll ID:", newPollId);
      
    } catch (error) {
      console.log("❌ Error creating poll:", error.message);
      return;
    }
    
    // Get poll info
    const pollCount = await votingContract.pollCount();
    const newPollId = pollCount.toNumber();
    
    try {
      const pollInfo = await votingContract.getPollInfo(newPollId);
      console.log("\n📊 New Poll Information:");
      console.log("Title:", pollInfo.title);
      console.log("Description:", pollInfo.description);
      console.log("Start time:", new Date(pollInfo.startTime * 1000).toLocaleString());
      console.log("End time:", new Date(pollInfo.endTime * 1000).toLocaleString());
      console.log("Is active:", pollInfo.isActive);
      console.log("Total votes:", pollInfo.totalVotes.toString());
      console.log("Options:", pollInfo.options);
      console.log("Current vote counts:", pollInfo.voteCounts.map(v => v.toString()));
      
      if (!pollInfo.isActive) {
        console.log("❌ Poll is not active. Cannot test voting.");
        return;
      }
      
    } catch (error) {
      console.log("❌ Error getting poll info:", error.message);
      return;
    }
    
    // Test voting with multiple users immediately
    const users = [user1, user2, user3, user4, user5];
    const votingOptions = [0, 1, 2, 0, 1]; // Different voting options for each user
    
    console.log("\n🗳️  Testing Multi-User Voting (Immediate):");
    console.log("===========================================");
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const option = votingOptions[i];
      
      console.log(`\n👤 User ${i + 1} (${user.address.slice(0, 6)}...${user.address.slice(-4)}) voting for option ${option} (${pollInfo.options[option]})...`);
      
      try {
        // Check if user has already voted
        const hasVoted = await votingContract.hasVoted(newPollId, user.address);
        
        if (hasVoted) {
          console.log("   ❌ Already voted in this poll");
          continue;
        }
        
        // Create contract instance with user as signer
        const userVotingContract = votingContract.connect(user);
        
        // Cast vote
        const tx = await userVotingContract.vote(newPollId, option);
        await tx.wait();
        console.log("   ✅ Vote cast successfully!");
        
        // Get updated poll info
        const updatedPollInfo = await votingContract.getPollInfo(newPollId);
        console.log(`   📊 Updated vote counts: [${updatedPollInfo.voteCounts.map(v => v.toString()).join(', ')}]`);
        console.log(`   📊 Total votes: ${updatedPollInfo.totalVotes.toString()}`);
        
      } catch (error) {
        console.log(`   ❌ Error voting: ${error.message}`);
      }
    }
    
    // Final poll status
    console.log("\n📊 Final Poll Status:");
    console.log("=====================");
    const finalPollInfo = await votingContract.getPollInfo(newPollId);
    console.log("Total votes:", finalPollInfo.totalVotes.toString());
    console.log("Vote counts per option:");
    for (let i = 0; i < finalPollInfo.options.length; i++) {
      console.log(`  ${finalPollInfo.options[i]}: ${finalPollInfo.voteCounts[i].toString()} votes`);
    }
    
    // Find winning option
    let maxVotes = 0;
    let winningOption = 0;
    for (let i = 0; i < finalPollInfo.voteCounts.length; i++) {
      if (finalPollInfo.voteCounts[i] > maxVotes) {
        maxVotes = finalPollInfo.voteCounts[i];
        winningOption = i;
      }
    }
    
    console.log(`\n🏆 Current winning option: ${finalPollInfo.options[winningOption]} (${maxVotes} votes)`);
    
    console.log("\n✅ Multi-user poll creation and immediate voting test completed!");
    
  } catch (error) {
    console.error("\n❌ Error in multi-user poll test:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
