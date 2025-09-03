const { ethers } = require("hardhat");

async function main() {
  console.log("=== Testing Voting on New Polls ===\n");

  try {
    const [owner, voter] = await ethers.getSigners();
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, voter);
    
    console.log("Owner address:", owner.address);
    console.log("Voter address:", voter.address);
    console.log("Contract address:", contractAddress);
    
    // Get current block timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Try to vote on the newest polls (7, 8, 9)
    for (let pollId = 7; pollId <= 9; pollId++) {
      console.log(`\n🗳️  Testing vote on Poll ${pollId}...`);
      
      try {
        // Check if voter has already voted
        const hasVoted = await votingContract.hasVoted(pollId, voter.address);
        console.log("Has voted:", hasVoted);
        
        if (!hasVoted) {
          // Vote for option 0
          console.log(`Casting vote for option 0 on poll ${pollId}...`);
          const tx = await votingContract.vote(pollId, 0);
          await tx.wait();
          console.log(`✅ Vote cast successfully on poll ${pollId}!`);
          
          // Check vote count
          const pollInfo = await votingContract.getPollInfo(pollId);
          console.log("Updated vote counts:", pollInfo.voteCounts.map(v => v.toString()));
        } else {
          console.log(`❌ Already voted in poll ${pollId}`);
        }
        
      } catch (error) {
        console.log(`❌ Error voting on poll ${pollId}:`, error.message);
      }
    }
    
    console.log("\n✅ Voting test completed!");
    
  } catch (error) {
    console.error("\n❌ Error testing voting:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
