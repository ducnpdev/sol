const { ethers } = require("hardhat");

async function main() {
  console.log("=== Creating Frontend Poll ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("Owner address:", owner.address);
    console.log("Contract address:", contractAddress);
    
    // Get current time and create a poll that starts immediately
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    
    console.log("Creating a simple test poll...");
    const tx = await votingContract.createPoll(
      "Frontend Test Poll",
      "This poll should appear in the frontend immediately",
      currentTime, // Start now
      currentTime + 3600, // End in 1 hour
      ["Yes", "No", "Maybe"]
    );
    
    await tx.wait();
    console.log("✅ Poll created successfully!");
    
    // Mine a block to ensure the transaction is processed
    await ethers.provider.send("evm_mine", []);
    
    console.log("\n🎉 Poll created! Now:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Click 'Refresh Polls' button");
    console.log("3. You should see 'Frontend Test Poll'");
    
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
