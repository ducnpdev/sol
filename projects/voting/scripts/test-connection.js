const { ethers } = require("hardhat");

async function main() {
  console.log("=== Testing Contract Connection ===\n");

  // Get signers
  const [owner, voter1, voter2] = await ethers.getSigners();
  
  // Contract address from deployment
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get contract factory and create contract instance
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);

  console.log("Contract address:", contractAddress);
  console.log("Owner address:", owner.address);
  
  try {
    // Test basic contract calls
    console.log("\n1. Testing contract owner...");
    const contractOwner = await votingContract.owner();
    console.log("Contract owner:", contractOwner);
    
    console.log("\n2. Testing poll count...");
    const pollCount = await votingContract.pollCount();
    console.log("Poll count:", pollCount.toString());
    
    if (pollCount > 0) {
      console.log("\n3. Testing poll info retrieval...");
      const pollInfo = await votingContract.getPollInfo(1);
      console.log("Poll 1 title:", pollInfo.title);
      console.log("Poll 1 description:", pollInfo.description);
      console.log("Poll 1 options:", pollInfo.options);
    } else {
      console.log("\n3. No polls exist yet. Creating a test poll...");
      
      const startTime = Math.floor(Date.now() / 1000) + 60;
      const endTime = startTime + 3600;
      
      const tx = await votingContract.createPoll(
        "Frontend Test Poll",
        "This is a test poll for the frontend",
        startTime,
        endTime,
        ["Yes", "No", "Maybe"]
      );
      await tx.wait();
      console.log("Test poll created successfully!");
      
      const newPollInfo = await votingContract.getPollInfo(1);
      console.log("New poll title:", newPollInfo.title);
    }
    
    console.log("\n4. Testing active polls...");
    const activePolls = await votingContract.getActivePolls();
    console.log("Active polls:", activePolls);
    
    console.log("\n✅ Contract connection test successful!");
    
  } catch (error) {
    console.error("\n❌ Contract connection test failed:");
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
