const { ethers } = require("hardhat");

async function main() {
  console.log("=== Network Connection Debug ===\n");

  try {
    // Test connection to localhost network
    console.log("1. Testing connection to localhost:8545...");
    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Test basic connection
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Connected! Current block number:", blockNumber);
    
    // Test accounts
    const accounts = await provider.listAccounts();
    console.log("✅ Available accounts:", accounts.length);
    console.log("First account:", accounts[0]);
    
    // Test contract connection
    console.log("\n2. Testing contract connection...");
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, provider);
    
    const owner = await votingContract.owner();
    console.log("✅ Contract owner:", owner);
    
    const pollCount = await votingContract.pollCount();
    console.log("✅ Poll count:", pollCount.toString());
    
    console.log("\n🎉 Network connection is working perfectly!");
    console.log("\nMetaMask should be configured with:");
    console.log("- Network Name: Hardhat Local");
    console.log("- RPC URL: http://127.0.0.1:8545");
    console.log("- Chain ID: 1337");
    
  } catch (error) {
    console.error("\n❌ Network connection failed:");
    console.error("Error:", error.message);
    console.log("\nMake sure:");
    console.log("1. Hardhat node is running: npx hardhat node");
    console.log("2. You're using the correct RPC URL: http://127.0.0.1:8545");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
