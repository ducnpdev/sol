const { ethers } = require("hardhat");

async function main() {
  console.log("=== Deploying Complete Voting System ===\n");

  try {
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    
    // Deploy VotingToken first
    console.log("\n1️⃣  Deploying VotingToken...");
    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = await VotingToken.deploy();
    await votingToken.waitForDeployment();
    
    const tokenAddress = await votingToken.getAddress();
    console.log("✅ VotingToken deployed to:", tokenAddress);
    console.log("✅ Token name:", await votingToken.name());
    console.log("✅ Token symbol:", await votingToken.symbol());
    console.log("✅ Total supply:", ethers.formatEther(await votingToken.totalSupply()));
    
    // Deploy VotingContract
    console.log("\n2️⃣  Deploying VotingContract...");
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
    
    const contractAddress = await votingContract.getAddress();
    console.log("✅ VotingContract deployed to:", contractAddress);
    console.log("✅ Owner:", await votingContract.owner());
    
    // Check owner's token balance
    const ownerBalance = await votingToken.balanceOf(owner.address);
    console.log("✅ Owner token balance:", ethers.formatEther(ownerBalance), "VOTE");
    
    console.log("\n🎉 Complete deployment successful!");
    
    console.log("\n📋 Contract Addresses:");
    console.log("VotingToken:", tokenAddress);
    console.log("VotingContract:", contractAddress);
    
    console.log("\n📝 To add token to MetaMask:");
    console.log("1. Open MetaMask");
    console.log("2. Click 'Import tokens'");
    console.log("3. Paste token address:", tokenAddress);
    console.log("4. Token symbol: VOTE");
    console.log("5. Decimals: 18");
    
    console.log("\n📝 Update your scripts with these addresses:");
    console.log(`Token address: "${tokenAddress}"`);
    console.log(`Contract address: "${contractAddress}"`);
    
    // Save addresses to a file for easy access
    const fs = require('fs');
    const addresses = {
      token: tokenAddress,
      contract: contractAddress,
      owner: owner.address
    };
    
    fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
    console.log("\n💾 Addresses saved to 'deployed-addresses.json'");
    
  } catch (error) {
    console.error("\n❌ Error deploying:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
