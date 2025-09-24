const { ethers } = require("hardhat");

async function main() {
  console.log("=== Testing Contract Connection ===\n");

  try {
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    
    // Test VotingToken connection
    console.log("\n1️⃣  Testing VotingToken connection...");
    const tokenAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
    
    try {
      const VotingToken = await ethers.getContractFactory("VotingToken");
      const votingToken = new ethers.Contract(tokenAddress, VotingToken.interface, owner);
      
      const tokenName = await votingToken.name();
      const tokenSymbol = await votingToken.symbol();
      const totalSupply = await votingToken.totalSupply();
      const ownerBalance = await votingToken.balanceOf(owner.address);
      
      console.log("✅ VotingToken connection successful!");
      console.log("   Name:", tokenName);
      console.log("   Symbol:", tokenSymbol);
      console.log("   Total Supply:", ethers.formatEther(totalSupply));
      console.log("   Owner Balance:", ethers.formatEther(ownerBalance));
      
    } catch (error) {
      console.log("❌ VotingToken connection failed:", error.message);
      return;
    }
    
    // Test VotingContract connection
    console.log("\n2️⃣  Testing VotingContract connection...");
    const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    
    try {
      const VotingContract = await ethers.getContractFactory("VotingContract");
      const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
      
      const pollCount = await votingContract.pollCount();
      const ownerAddress = await votingContract.owner();
      
      console.log("✅ VotingContract connection successful!");
      console.log("   Poll Count:", pollCount.toString());
      console.log("   Owner:", ownerAddress);
      
    } catch (error) {
      console.log("❌ VotingContract connection failed:", error.message);
      return;
    }
    
    console.log("\n🎉 All contract connections successful!");
    console.log("\n📝 You can now run:");
    console.log("npx hardhat run scripts/setup-multi-user-accounts.js --network localhost");
    
  } catch (error) {
    console.error("\n❌ Error testing connections:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
