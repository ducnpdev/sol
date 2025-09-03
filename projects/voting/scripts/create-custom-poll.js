const { ethers } = require("hardhat");

async function main() {
  console.log("=== Creating Custom Poll ===\n");

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
    
    // Poll details - you can modify these
    const pollTitle = "Bạn thích món ăn nào nhất?";
    const pollDescription = "Hãy chọn món ăn yêu thích của bạn";
    const pollOptions = ["Phở", "Bún chả", "Bánh mì", "Cơm tấm", "Bún bò"];
    
    // Time settings - poll starts in 5 minutes and runs for 24 hours
    const startTime = currentTime + 300; // Start in 5 minutes
    const endTime = startTime + 86400; // End in 24 hours
    
    console.log("\n📋 Creating poll with details:");
    console.log(`Title: ${pollTitle}`);
    console.log(`Description: ${pollDescription}`);
    console.log(`Options: ${pollOptions.join(', ')}`);
    console.log(`Start Time: ${new Date(startTime * 1000).toLocaleString()}`);
    console.log(`End Time: ${new Date(endTime * 1000).toLocaleString()}`);
    
    // Create the poll
    console.log("\n🗳️  Creating poll...");
    const tx = await votingContract.createPoll(
      pollTitle,
      pollDescription,
      startTime,
      endTime,
      pollOptions
    );
    await tx.wait();
    
    console.log("✅ Poll created successfully!");
    
    // Get poll count to show the new poll ID
    const pollCount = await votingContract.pollCount();
    const pollCountNumber = pollCount._isBigNumber ? pollCount.toNumber() : pollCount;
    console.log(`\n📊 New poll ID: ${pollCountNumber}`);
    
    // Advance time slightly to make poll active
    console.log("\n⏰ Advancing time to make poll active...");
    for (let i = 0; i < 3; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    console.log("\n🎉 Poll is now active and ready for voting!");
    console.log("📝 You can now:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Refresh the page (F5 or Cmd+R)");
    console.log("3. Vote on your new poll!");
    
  } catch (error) {
    console.error("\n❌ Error creating poll:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
