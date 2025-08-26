const { ethers } = require("hardhat");

async function main() {
  console.log("=== Frontend Debug Test ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("1. Testing basic contract connection...");
    console.log("Contract address:", contractAddress);
    console.log("Owner address:", owner.address);
    
    // Test owner function
    try {
      const contractOwner = await votingContract.owner();
      console.log("✅ Contract owner:", contractOwner);
    } catch (error) {
      console.log("❌ Error getting owner:", error.message);
    }
    
    // Test poll count
    try {
      const pollCount = await votingContract.pollCount();
      console.log("✅ Poll count:", pollCount.toString());
    } catch (error) {
      console.log("❌ Error getting poll count:", error.message);
    }
    
    // Test getting active polls
    console.log("\n2. Testing getActivePolls function...");
    try {
      const activePolls = await votingContract.getActivePolls();
      console.log("✅ Active polls array:", activePolls);
      console.log("✅ Number of active polls:", activePolls.length);
      
      if (activePolls.length > 0) {
        console.log("\n3. Testing individual poll data...");
        for (let i = 0; i < activePolls.length; i++) {
          const pollId = activePolls[i];
          console.log(`\nPoll ${pollId.toString()}:`);
          
          try {
            const pollInfo = await votingContract.getPollInfo(pollId);
            console.log(`   Title: ${pollInfo.title}`);
            console.log(`   Description: ${pollInfo.description}`);
            console.log(`   Is Active: ${pollInfo.isActive}`);
            console.log(`   Total Votes: ${pollInfo.totalVotes.toString()}`);
            console.log(`   Options: ${pollInfo.options.join(', ')}`);
            console.log(`   Vote Counts: [${pollInfo.voteCounts.map(v => v.toString()).join(', ')}]`);
          } catch (error) {
            console.log(`   ❌ Error reading poll ${pollId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log("❌ Error getting active polls:", error.message);
    }
    
    // Test hasVoted function
    console.log("\n4. Testing hasVoted function...");
    try {
      const hasVoted = await votingContract.hasVoted(1, owner.address);
      console.log("✅ Has voted on poll 1:", hasVoted);
    } catch (error) {
      console.log("❌ Error checking hasVoted:", error.message);
    }
    
    console.log("\n=== Debug Summary ===");
    console.log("If you see ✅ marks, the contract is working correctly.");
    console.log("If you see ❌ marks, there's an issue with that function.");
    console.log("\nFrontend troubleshooting:");
    console.log("1. Check browser console for JavaScript errors");
    console.log("2. Verify MetaMask is connected to Hardhat Local");
    console.log("3. Make sure you're using the owner account");
    
  } catch (error) {
    console.error("\n❌ Debug test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
