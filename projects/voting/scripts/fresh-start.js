const { ethers } = require("hardhat");

async function main() {
  console.log("=== Fresh Start: Deploy and Create Polls ===\n");

  try {
    const [owner] = await ethers.getSigners();
    
    console.log("1. Deploying VotingContract...");
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
    
    const address = await votingContract.getAddress();
    console.log("✅ Contract deployed to:", address);
    console.log("✅ Owner:", await votingContract.owner());
    
    // Mine a few blocks to ensure deployment is processed
    for (let i = 0; i < 3; i++) {
      await ethers.provider.send("evm_mine", []);
    }
    
    console.log("\n2. Creating test poll...");
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    
    const tx = await votingContract.createPoll(
      "Fresh Start Test Poll",
      "This poll was created after a fresh deployment",
      currentTime + 60, // Start in 1 minute
      currentTime + 3660, // End in 1 hour + 1 minute
      ["Option A", "Option B", "Option C"]
    );
    
    await tx.wait();
    console.log("✅ Poll created successfully!");
    
    // Mine another block
    await ethers.provider.send("evm_mine", []);
    
    console.log("\n3. Verifying poll data...");
    const pollCount = await votingContract.pollCount();
    console.log("✅ Poll count:", pollCount.toString());
    
    const activePolls = await votingContract.getActivePolls();
    console.log("✅ Active polls:", activePolls.length);
    
    if (activePolls.length > 0) {
      const pollInfo = await votingContract.getPollInfo(1);
      console.log("✅ Poll 1 title:", pollInfo.title);
      console.log("✅ Poll 1 is active:", pollInfo.isActive);
    }
    
    console.log("\n🎉 Fresh start completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Update your frontend to use this contract address:", address);
    console.log("2. Go to http://localhost:3000");
    console.log("3. Refresh the page");
    console.log("4. You should see 'Fresh Start Test Poll'");
    
  } catch (error) {
    console.error("\n❌ Fresh start failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
