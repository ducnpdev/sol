const { ethers } = require("hardhat");

async function main() {
  console.log("=== Transferring Tokens ===\n");

  try {
    const [owner, account1] = await ethers.getSigners();
    const tokenAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
    
    console.log("Owner address:", owner.address);
    console.log("Account #1 address:", account1.address);
    console.log("Token address:", tokenAddress);
    
    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = new ethers.Contract(tokenAddress, VotingToken.interface, account1);
    
    // Transfer tokens from Account #1 to Owner
    console.log("\nTransferring 100,000 VOTE tokens from Account #1 to Owner...");
    const transferAmount = ethers.parseEther("100000"); // 100,000 tokens
    
    const tx = await votingToken.transfer(owner.address, transferAmount);
    await tx.wait();
    
    console.log("✅ Transfer successful!");
    
    // Check balances
    const ownerBalance = await votingToken.balanceOf(owner.address);
    const account1Balance = await votingToken.balanceOf(account1.address);
    
    console.log("\n📊 Token Balances:");
    console.log("Owner balance:", ethers.formatEther(ownerBalance), "VOTE");
    console.log("Account #1 balance:", ethers.formatEther(account1Balance), "VOTE");
    
    console.log("\n🎉 Token transfer completed!");
    console.log("\n📝 To add token to MetaMask:");
    console.log("1. Open MetaMask");
    console.log("2. Click 'Import tokens' (at the bottom of the token list)");
    console.log("3. Paste this contract address:", tokenAddress);
    console.log("4. Token symbol: VOTE");
    console.log("5. Decimals: 18");
    console.log("6. Click 'Add Custom Token'");
    
    console.log("\n📋 Contract Addresses:");
    console.log("- Voting Contract:", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
    console.log("- Voting Token:", tokenAddress);
    
  } catch (error) {
    console.error("\n❌ Error transferring tokens:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
