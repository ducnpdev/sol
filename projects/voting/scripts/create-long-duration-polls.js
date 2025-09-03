const { ethers } = require("hardhat");

async function main() {
  console.log("=== Creating Long Duration Polls ===\n");

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
    
    // Create polls with longer durations (24 hours)
    console.log("\n1. Creating 'Đồng Nghiệp Nào Gét Nhất' poll (24 hours)...");
    const startTime1 = currentTime + 60; // Start in 1 minute
    const endTime1 = startTime1 + 86400; // End in 24 hours
    
    const tx1 = await votingContract.createPoll(
      "Đồng Nghiệp Nào Gét Nhất",
      "Người hay sếp mà bạn thấy là muốn đấm nhất.?",
      startTime1,
      endTime1,
      ["Hoà", "Trí", "Tuấn", "Khác"]
    );
    await tx1.wait();
    console.log("✅ First poll created!");
    
    // // Create second poll
    // console.log("\n2. Creating 'Best Blockchain Platform' poll (24 hours)...");
    // const startTime2 = currentTime + 120; // Start in 2 minutes
    // const endTime2 = startTime2 + 86400; // End in 24 hours
    
    // const tx2 = await votingContract.createPoll(
    //   "Best Blockchain Platform",
    //   "Which blockchain platform do you think is the best?",
    //   startTime2,
    //   endTime2,
    //   ["Ethereum", "Polygon", "Binance Smart Chain", "Solana"]
    // );
    // await tx2.wait();
    // console.log("✅ Second poll created!");
    
    // // Create third poll
    // console.log("\n3. Creating 'DeFi Protocol Preference' poll (24 hours)...");
    // const startTime3 = currentTime + 180; // Start in 3 minutes
    // const endTime3 = startTime3 + 86400; // End in 24 hours
    
    // const tx3 = await votingContract.createPoll(
    //   "DeFi Protocol Preference",
    //   "Which DeFi protocol do you use most often?",
    //   startTime3,
    //   endTime3,
    //   ["Uniswap", "Aave", "Compound", "Curve", "Other"]
    // );
    // await tx3.wait();
    // console.log("✅ Third poll created!");
    
    // Mine a few blocks to advance time slightly
    console.log("\n⏰ Advancing time slightly to make polls active...");
    for (let i = 0; i < 3; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    console.log("\n🎉 Successfully created 3 long-duration polls!");
    console.log("📝 Now you can:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Refresh the page (F5 or Cmd+R)");
    console.log("3. You should see 3 active polls ready for voting!");
    console.log("4. These polls will stay active for 24 hours");
    
  } catch (error) {
    console.error("\n❌ Error creating polls:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
