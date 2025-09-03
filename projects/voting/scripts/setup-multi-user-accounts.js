const { ethers } = require("hardhat");

async function main() {
  console.log("=== Setting Up Multi-User Accounts ===\n");

  try {
    // Get multiple signers (accounts)
    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = new ethers.Contract(tokenAddress, VotingToken.interface, owner);
    
    console.log("📋 Account Setup:");
    console.log("Owner address:", owner.address);
    console.log("User 1 address:", user1.address);
    console.log("User 2 address:", user2.address);
    console.log("User 3 address:", user3.address);
    console.log("User 4 address:", user4.address);
    console.log("User 5 address:", user5.address);
    console.log("Token address:", tokenAddress);
    
    // Check token details
    const tokenName = await votingToken.name();
    const tokenSymbol = await votingToken.symbol();
    console.log(`\nToken: ${tokenName} (${tokenSymbol})`);
    
    // Check owner's balance
    const ownerBalance = await votingToken.balanceOf(owner.address);
    console.log(`Owner balance: ${ethers.utils.formatEther(ownerBalance)} ${tokenSymbol}`);
    
    // Setup multiple users with tokens
    const users = [user1, user2, user3, user4, user5];
    const transferAmount = ethers.utils.parseEther("500"); // Transfer 500 tokens to each user
    
    console.log(`\n💰 Transferring ${ethers.utils.formatEther(transferAmount)} ${tokenSymbol} to each user...`);
    console.log("=====================================");
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        console.log(`\n👤 Setting up User ${i + 1} (${user.address.slice(0, 6)}...${user.address.slice(-4)})...`);
        
        // Check current balance
        const currentBalance = await votingToken.balanceOf(user.address);
        console.log(`   Current balance: ${ethers.utils.formatEther(currentBalance)} ${tokenSymbol}`);
        
        if (currentBalance.gte(transferAmount)) {
          console.log(`   ✅ Already has sufficient balance`);
          continue;
        }
        
        // Transfer tokens
        const tx = await votingToken.transfer(user.address, transferAmount);
        await tx.wait();
        console.log(`   ✅ Transferred ${ethers.utils.formatEther(transferAmount)} ${tokenSymbol}`);
        
        // Check new balance
        const newBalance = await votingToken.balanceOf(user.address);
        console.log(`   New balance: ${ethers.utils.formatEther(newBalance)} ${tokenSymbol}`);
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Final balance summary
    console.log("\n📊 Final Balance Summary:");
    console.log("=========================");
    console.log(`Owner: ${ethers.utils.formatEther(await votingToken.balanceOf(owner.address))} ${tokenSymbol}`);
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const balance = await votingToken.balanceOf(user.address);
      console.log(`User ${i + 1}: ${ethers.utils.formatEther(balance)} ${tokenSymbol}`);
    }
    
    console.log(`\n📝 To use these accounts in MetaMask:`);
    console.log(`1. Open MetaMask`);
    console.log(`2. Click "Import Account"`);
    console.log(`3. Enter private key for each account`);
    console.log(`4. Import the token: ${tokenAddress}`);
    console.log(`5. Switch between accounts to test multi-user voting`);
    
    console.log(`\n🔑 Private Keys (for testing only):`);
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`User ${i + 1}: ${user.privateKey}`);
    }
    
    console.log("\n✅ Multi-user account setup completed!");
    
  } catch (error) {
    console.error("\n❌ Error setting up multi-user accounts:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
