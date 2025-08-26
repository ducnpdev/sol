const { ethers } = require("hardhat");

async function main() {
  console.log("=== Deploying VotingToken to Next Address ===\n");

  try {
    const [owner] = await ethers.getSigners();
    
    console.log("Deploying VotingToken...");
    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = await VotingToken.deploy();
    await votingToken.waitForDeployment();
    
    const address = await votingToken.getAddress();
    console.log("✅ VotingToken deployed to:", address);
    console.log("✅ Token name:", await votingToken.name());
    console.log("✅ Token symbol:", await votingToken.symbol());
    console.log("✅ Total supply:", ethers.formatEther(await votingToken.totalSupply()));
    console.log("✅ Owner:", await votingToken.owner());
    
    // Check owner's balance
    const ownerBalance = await votingToken.balanceOf(owner.address);
    console.log("✅ Owner balance:", ethers.formatEther(ownerBalance), "VOTE");
    
    console.log("\n🎉 Token deployment successful!");
    console.log("\n📝 To add token to MetaMask:");
    console.log("1. Open MetaMask");
    console.log("2. Click 'Import tokens' (at the bottom of the token list)");
    console.log("3. Paste this contract address:", address);
    console.log("4. Token symbol: VOTE");
    console.log("5. Decimals: 18");
    console.log("6. Click 'Add Custom Token'");
    
    console.log("\n📋 Contract Addresses:");
    console.log("- Voting Contract:", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
    console.log("- Voting Token:", address);
    
  } catch (error) {
    console.error("\n❌ Error deploying token:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
