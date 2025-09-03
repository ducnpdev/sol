const { ethers } = require("hardhat");

async function main() {
  console.log("=== Advancing Time ===\n");

  try {
    // Get current block timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Mine blocks to advance time by 5 minutes
    console.log("\n⏰ Advancing time by 5 minutes...");
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    // Get updated timestamp
    const updatedBlock = await ethers.provider.getBlock("latest");
    const updatedTime = updatedBlock.timestamp;
    console.log("Updated time:", new Date(updatedTime * 1000).toLocaleString());
    
    console.log("\n✅ Time advanced successfully!");
    console.log("📝 The polls should now be active for voting!");
    
  } catch (error) {
    console.error("\n❌ Error advancing time:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
