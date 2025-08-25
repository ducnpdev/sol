const { ethers } = require("hardhat");

async function main() {
  console.log("=== Simple Voting Contract Test ===\n");

  const [owner, voter1, voter2] = await ethers.getSigners();
  
  // Deploy a fresh contract
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();
  await votingContract.waitForDeployment();
  
  const address = await votingContract.getAddress();
  console.log("Contract deployed to:", address);
  console.log("Owner:", await votingContract.owner());

  // Create a poll
  console.log("\n1. Creating a poll...");
  const startTime = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
  const endTime = startTime + 3600; // End in 1 hour
  
  const tx = await votingContract.connect(owner).createPoll(
    "Test Poll",
    "Test Description",
    startTime,
    endTime,
    ["Option 1", "Option 2", "Option 3"]
  );
  await tx.wait();
  console.log("Poll created successfully!");

  // Check poll count
  const pollCount = await votingContract.pollCount();
  console.log("Poll count:", pollCount.toString());

  // Get poll info
  console.log("\n2. Getting poll info...");
  const pollInfo = await votingContract.getPollInfo(1);
  console.log("Poll title:", pollInfo.title);
  console.log("Poll description:", pollInfo.description);
  console.log("Poll options:", pollInfo.options);
  console.log("Is active:", pollInfo.isActive);

  // Wait for poll to start
  console.log("\n3. Waiting for poll to start...");
  await ethers.provider.send("evm_increaseTime", [61]);
  await ethers.provider.send("evm_mine");

  // Vote
  console.log("\n4. Casting votes...");
  const voteTx = await votingContract.connect(voter1).vote(1, 0);
  await voteTx.wait();
  console.log("Vote cast successfully!");

  // Check results
  const updatedPollInfo = await votingContract.getPollInfo(1);
  console.log("\n5. Updated poll results:");
  console.log("Total votes:", updatedPollInfo.totalVotes.toString());
  console.log("Vote counts:", updatedPollInfo.voteCounts.map(v => v.toString()));

  console.log("\n=== Test completed successfully! ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
