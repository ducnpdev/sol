const { ethers } = require("hardhat");

async function main() {
  console.log("=== Checking Poll Status ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("Owner address:", owner.address);
    console.log("Contract address:", contractAddress);
    
    // Get current block timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Try to get poll count
    try {
      const pollCount = await votingContract.pollCount();
      const pollCountNumber = pollCount._isBigNumber ? pollCount.toNumber() : pollCount;
      console.log(`\n📊 Total polls: ${pollCountNumber}`);
      
      // Check each poll
      for (let i = 1; i <= pollCountNumber; i++) {
        try {
          const pollInfo = await votingContract.getPollInfo(i);
          const startTime = pollInfo.startTime._isBigNumber ? pollInfo.startTime.toNumber() : pollInfo.startTime;
          const endTime = pollInfo.endTime._isBigNumber ? pollInfo.endTime.toNumber() : pollInfo.endTime;
          const isActive = pollInfo.isActive && startTime <= currentTime && endTime >= currentTime;
          
          console.log(`\n📋 Poll ${i}:`);
          console.log(`  Title: ${pollInfo.title}`);
          console.log(`  Start Time: ${new Date(startTime * 1000).toLocaleString()}`);
          console.log(`  End Time: ${new Date(endTime * 1000).toLocaleString()}`);
          console.log(`  Is Active: ${pollInfo.isActive}`);
          console.log(`  Can Vote: ${isActive ? '✅ YES' : '❌ NO'}`);
          console.log(`  Options: ${pollInfo.options.join(', ')}`);
          
          if (isActive) {
            console.log(`  🗳️  This poll is ready for voting!`);
          }
        } catch (error) {
          console.log(`Poll ${i}: Error reading poll data - ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log(`\n📊 Error getting poll count: ${error.message}`);
    }
    
    console.log("\n✅ Poll status check completed!");
    
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
