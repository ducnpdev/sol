const { ethers } = require("hardhat");

async function main() {
  console.log("=== Checking All Polls ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("Contract address:", contractAddress);
    console.log("Owner address:", owner.address);
    
    // Get poll count
    const pollCount = await votingContract.pollCount();
    console.log(`\n📊 Total polls created: ${pollCount.toString()}`);
    
    if (pollCount > 0) {
      console.log("\n📋 All Polls:");
      console.log("=" .repeat(50));
      
      for (let i = 1; i <= pollCount; i++) {
        try {
          const pollInfo = await votingContract.getPollInfo(i);
          console.log(`\n${i}. ${pollInfo.title}`);
          console.log(`   Description: ${pollInfo.description}`);
          console.log(`   Status: ${pollInfo.isActive ? '🟢 Active' : '🔴 Ended'}`);
          console.log(`   Start: ${new Date(pollInfo.startTime * 1000).toLocaleString()}`);
          console.log(`   End: ${new Date(pollInfo.endTime * 1000).toLocaleString()}`);
          console.log(`   Total Votes: ${pollInfo.totalVotes.toString()}`);
          console.log(`   Options: ${pollInfo.options.join(', ')}`);
          console.log(`   Vote Counts: [${pollInfo.voteCounts.map(v => v.toString()).join(', ')}]`);
        } catch (error) {
          console.log(`\n${i}. Error reading poll: ${error.message}`);
        }
      }
      
      // Get active polls
      console.log("\n🟢 Active Polls (ready for voting):");
      console.log("=" .repeat(50));
      const activePolls = await votingContract.getActivePolls();
      if (activePolls.length > 0) {
        activePolls.forEach((pollId, index) => {
          console.log(`${index + 1}. Poll ID: ${pollId.toString()}`);
        });
      } else {
        console.log("No active polls at the moment.");
      }
      
    } else {
      console.log("No polls have been created yet.");
    }
    
    console.log("\n✅ Poll check completed!");
    console.log("\n💡 If you don't see polls in the frontend:");
    console.log("1. Make sure you're connected with the owner account");
    console.log("2. Refresh the page (F5 or Cmd+R)");
    console.log("3. Check the 'Active Polls' tab");
    
  } catch (error) {
    console.error("\n❌ Error checking polls:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
