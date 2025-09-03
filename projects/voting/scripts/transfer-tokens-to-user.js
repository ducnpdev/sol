const { ethers } = require("hardhat");

async function main() {
  console.log("=== Transferring VotingTokens to User ===\n");

  try {
    const [owner, user] = await ethers.getSigners();
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = new ethers.Contract(tokenAddress, VotingToken.interface, owner);
    
    console.log("Owner address:", owner.address);
    console.log("User address:", user.address);
    console.log("Token address:", tokenAddress);
    
    // Check token details
    const tokenName = await votingToken.name();
    const tokenSymbol = await votingToken.symbol();
    console.log(`\nToken: ${tokenName} (${tokenSymbol})`);
    
    // Check owner's balance
    const ownerBalance = await votingToken.balanceOf(owner.address);
    console.log(`Owner balance: ${ethers.utils.formatEther(ownerBalance)} ${tokenSymbol}`);
    
    // Transfer tokens to user
    const transferAmount = ethers.utils.parseEther("1000"); // Transfer 1000 tokens
    console.log(`\nTransferring ${ethers.utils.formatEther(transferAmount)} ${tokenSymbol} to user...`);
    
    const tx = await votingToken.transfer(user.address, transferAmount);
    await tx.wait();
    
    console.log("✅ Transfer successful!");
    
    // Check new balances
    const newOwnerBalance = await votingToken.balanceOf(owner.address);
    const userBalance = await votingToken.balanceOf(user.address);
    
    console.log(`\nUpdated balances:`);
    console.log(`Owner: ${ethers.utils.formatEther(newOwnerBalance)} ${tokenSymbol}`);
    console.log(`User: ${ethers.utils.formatEther(userBalance)} ${tokenSymbol}`);
    
    console.log(`\n📝 To import this token in MetaMask:`);
    console.log(`1. Open MetaMask`);
    console.log(`2. Click "Import tokens"`);
    console.log(`3. Enter token contract address: ${tokenAddress}`);
    console.log(`4. Token symbol should auto-fill: ${tokenSymbol}`);
    console.log(`5. Click "Add Custom Token"`);
    console.log(`6. Click "Import Tokens"`);
    
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
