const { ethers } = require("hardhat");

async function main() {
  console.log("=== Testing Poll Creation ===\n");

  try {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
    
    const VotingContract = await ethers.getContractFactory("VotingContract");
    const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);
    
    console.log("Owner address:", owner.address);
    console.log("Contract address:", contractAddress);
    
    // Get current block timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTime = currentBlock.timestamp;
    console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
    
    // Check current poll count
    const currentPollCount = await votingContract.pollCount();
    console.log("Current poll count:", Number(currentPollCount));
    
    // Create a new poll
    console.log("\n🗳️  Creating a new poll...");
    
    const pollTitle = "Test Poll";
    const pollDescription = "Testing poll creation";
    const startTime = currentTime + 60; // Start in 1 minute
    const endTime = currentTime + 3600; // End in 1 hour
    const options = ["Yes", "No"];
    
    console.log("Title:", pollTitle);
    console.log("Start time:", new Date(startTime * 1000).toLocaleString());
    console.log("End time:", new Date(endTime * 1000).toLocaleString());
    console.log("Options:", options.join(", "));
    
    try {
      const tx = await votingContract.createPoll(
        pollTitle,
        pollDescription,
        startTime,
        endTime,
        options
      );
      await tx.wait();
      console.log("✅ Poll created successfully!");
      
      // Get the new poll count
      const newPollCount = await votingContract.pollCount();
      const newPollId = Number(newPollCount);
      console.log("New poll count:", newPollId);
      
      // Get poll info
      const pollInfo = await votingContract.getPollInfo(newPollId);
      console.log("\n📊 Poll Information:");
      console.log("ID:", pollInfo.id.toString());
      console.log("Title:", pollInfo.title);
      console.log("Description:", pollInfo.description);
      console.log("Start time:", new Date(Number(pollInfo.startTime) * 1000).toLocaleString());
      console.log("End time:", new Date(Number(pollInfo.endTime) * 1000).toLocaleString());
      console.log("Is active:", pollInfo.isActive);
      console.log("Options:", pollInfo.options);
      console.log("Vote counts:", pollInfo.voteCounts.map(v => v.toString()));
      
    } catch (error) {
      console.log("❌ Error creating poll:", error.message);
    }
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
