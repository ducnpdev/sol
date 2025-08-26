const { ethers } = require("hardhat");

async function main() {
  console.log("=== Activating Polls ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("1. Advancing time to activate polls...");
    
    // Advance time by 2 minutes to ensure polls are active
    await ethers.provider.send("evm_increaseTime", [120]); // 2 minutes
    await ethers.provider.send("evm_mine", []);
    
    console.log("✅ Time advanced by 2 minutes");
    
    console.log("\n2. Checking poll status...");
    const pollCount = await votingContract.pollCount();
    console.log("✅ Poll count:", pollCount.toString());
    
    if (pollCount > 0) {
      const pollInfo = await votingContract.getPollInfo(1);
      console.log("✅ Poll 1 title:", pollInfo.title);
      console.log("✅ Poll 1 is active:", pollInfo.isActive);
      console.log("✅ Poll 1 start time:", new Date(pollInfo.startTime * 1000).toLocaleString());
      console.log("✅ Poll 1 end time:", new Date(pollInfo.endTime * 1000).toLocaleString());
    }
    
    console.log("\n3. Getting active polls...");
    const activePolls = await votingContract.getActivePolls();
    console.log("✅ Active polls count:", activePolls.length);
    
    if (activePolls.length > 0) {
      console.log("✅ Active poll IDs:", activePolls.map(p => p.toString()));
    }
    
    console.log("\n🎉 Polls should now be active!");
    console.log("\n📝 Now try:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Refresh the page");
    console.log("3. Click 'Refresh Polls'");
    console.log("4. You should see the active polls!");
    
  } catch (error) {
    console.error("\n❌ Error activating polls:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
