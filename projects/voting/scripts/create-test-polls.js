const { ethers } = require("hardhat");

async function main() {
  console.log("=== Creating Test Polls ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);

    console.log("Owner address:", owner.address);
    console.log("Contract address:", contractAddress);

    // Create first poll
    console.log("\n1. Creating 'Favorite Programming Language' poll...");
    const startTime1 = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
    const endTime1 = startTime1 + 3600; // End in 1 hour

    const tx1 = await votingContract.createPoll(
      "Favorite Programming Language",
      "Which programming language do you prefer for blockchain development?",
      startTime1,
      endTime1,
      ["Solidity", "JavaScript", "Python", "Rust"]
    );
    await tx1.wait();
    console.log("✅ First poll created!");

    // Create second poll
    console.log("\n2. Creating 'Best Blockchain Platform' poll...");
    const startTime2 = Math.floor(Date.now() / 1000) + 120; // Start in 2 minutes
    const endTime2 = startTime2 + 7200; // End in 2 hours

    const tx2 = await votingContract.createPoll(
      "Best Blockchain Platform",
      "Which blockchain platform do you think is the best?",
      startTime2,
      endTime2,
      ["Ethereum", "Polygon", "Binance Smart Chain", "Solana"]
    );
    await tx2.wait();
    console.log("✅ Second poll created!");
    
    // Create third poll
    console.log("\n3. Creating 'DeFi Protocol Preference' poll...");
    const startTime3 = Math.floor(Date.now() / 1000) + 180; // Start in 3 minutes
    const endTime3 = startTime3 + 5400; // End in 1.5 hours

    const tx3 = await votingContract.createPoll(
      "DeFi Protocol Preference",
      "Which DeFi protocol do you use most often?",
      startTime3,
      endTime3,
      ["Uniswap", "Aave", "Compound", "Curve", "Other"]
    );
    await tx3.wait();
    console.log("✅ Third poll created!");

    // Check poll count
    const pollCount = await votingContract.pollCount();
    console.log(`\n🎉 Successfully created ${pollCount.toString()} polls!`);

    // Show active polls
    const activePolls = await votingContract.getActivePolls();
    console.log("Active polls:", activePolls.map(p => p.toString()));

    console.log("\n📝 Now you can:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Connect MetaMask with the owner account");
    console.log("3. View and vote on the polls!");

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
