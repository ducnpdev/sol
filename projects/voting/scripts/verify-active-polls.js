const { ethers } = require("hardhat");

async function main() {
  console.log("=== Verifying Active Polls ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    // Get current time
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Get active polls
    console.log("\n🔍 Checking for active polls...");
    const activePolls = await votingContract.getActivePolls();
    
    if (activePolls.length > 0) {
      console.log(`✅ Found ${activePolls.length} active polls!`);
      
      for (let i = 0; i < activePolls.length; i++) {
        const pollId = activePolls[i];
        console.log(`\n📊 Poll ${pollId.toString()}:`);
        
        try {
          const pollInfo = await votingContract.getPollInfo(pollId);
          console.log(`   Title: ${pollInfo.title}`);
          console.log(`   Description: ${pollInfo.description}`);
          console.log(`   Status: 🟢 ACTIVE`);
          console.log(`   Start: ${new Date(pollInfo.startTime * 1000).toLocaleString()}`);
          console.log(`   End: ${new Date(pollInfo.endTime * 1000).toLocaleString()}`);
          console.log(`   Total Votes: ${pollInfo.totalVotes.toString()}`);
          console.log(`   Options: ${pollInfo.options.join(', ')}`);
          console.log(`   Vote Counts: [${pollInfo.voteCounts.map(v => v.toString()).join(', ')}]`);
        } catch (error) {
          console.log(`   Error reading poll: ${error.message}`);
        }
      }
      
      console.log("\n🎉 All polls are active and ready for voting!");
      console.log("You should see these polls in your frontend now.");
      
    } else {
      console.log("❌ No active polls found.");
      console.log("This might mean:");
      console.log("1. Polls haven't been created yet");
      console.log("2. Polls haven't started yet (future start time)");
      console.log("3. Polls have already ended");
    }
    
  } catch (error) {
    console.error("\n❌ Error verifying polls:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
