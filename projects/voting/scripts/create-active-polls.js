const { ethers } = require("hardhat");

async function main() {
  console.log("=== Creating Active Polls (Starting Now) ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("Owner address:", owner.address);
    console.log("Contract address:", contractAddress);
    
    // Get current block timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Create first poll - starts immediately
    console.log("\n1. Creating 'Favorite Programming Language' poll (starts now)...");
    const startTime1 = currentTime; // Start immediately
    const endTime1 = currentTime + 3600; // End in 1 hour
    
    const tx1 = await votingContract.createPoll(
      "Favorite Programming Language",
      "Which programming language do you prefer for blockchain development?",
      startTime1,
      endTime1,
      ["Solidity", "JavaScript", "Python", "Rust"]
    );
    await tx1.wait();
    console.log("✅ First poll created!");
    
    // Create second poll - starts immediately
    console.log("\n2. Creating 'Best Blockchain Platform' poll (starts now)...");
    const startTime2 = currentTime; // Start immediately
    const endTime2 = currentTime + 7200; // End in 2 hours
    
    const tx2 = await votingContract.createPoll(
      "Best Blockchain Platform",
      "Which blockchain platform do you think is the best?",
      startTime2,
      endTime2,
      ["Ethereum", "Polygon", "Binance Smart Chain", "Solana"]
    );
    await tx2.wait();
    console.log("✅ Second poll created!");
    
    // Create third poll - starts immediately
    console.log("\n3. Creating 'DeFi Protocol Preference' poll (starts now)...");
    const startTime3 = currentTime; // Start immediately
    const endTime3 = currentTime + 5400; // End in 1.5 hours
    
    const tx3 = await votingContract.createPoll(
      "DeFi Protocol Preference",
      "Which DeFi protocol do you use most often?",
      startTime3,
      endTime3,
      ["Uniswap", "Aave", "Compound", "Curve", "Other"]
    );
    await tx3.wait();
    console.log("✅ Third poll created!");
    
    // Mine a few blocks to advance time
    console.log("\n4. Advancing time to ensure polls are active...");
    for (let i = 0; i < 5; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    console.log("\n🎉 Successfully created 3 active polls!");
    console.log("All polls start immediately and are ready for voting.");
    
    console.log("\n📝 Now you can:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Refresh the page (F5 or Cmd+R)");
    console.log("3. You should see 3 active polls ready for voting!");
    
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
