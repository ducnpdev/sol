const { ethers } = require("hardhat");

async function main() {
  console.log("=== Deploying VotingToken with Account #1 ===\n");

  try {
    const [owner, account1] = await ethers.getSigners();
    
    console.log("Owner address:", owner.address);
    console.log("Account #1 address:", account1.address);
    
    console.log("Deploying VotingToken with Account #1...");
    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = await VotingToken.connect(account1).deploy();
    await votingToken.waitForDeployment();
    
    const address = await votingToken.getAddress();
    console.log("✅ VotingToken deployed to:", address);
    console.log("✅ Token name:", await votingToken.name());
    console.log("✅ Token symbol:", await votingToken.symbol());
    console.log("✅ Total supply:", ethers.formatEther(await votingToken.totalSupply()));
    console.log("✅ Owner:", await votingToken.owner());
    
    // Check owner's balance
    const ownerBalance = await votingToken.balanceOf(account1.address);
    console.log("✅ Account #1 balance:", ethers.formatEther(ownerBalance), "VOTE");
    
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
    
    console.log("\n💡 Note: The token owner is Account #1, not the main owner account.");
    
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
