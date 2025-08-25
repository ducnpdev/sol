const { ethers } = require("hardhat");

async function main() {
  // Get the deployed contract address (you'll need to update this after deployment)
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const [owner, voter1, voter2, voter3] = await ethers.getSigners();
  
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = new ethers.Contract(contractAddress, VotingContract.interface, owner);

  console.log("=== Voting Contract Interaction Demo ===\n");

  // Create a poll
  console.log("1. Creating a new poll...");
  const pollTitle = "Favorite Programming Language";
  const pollDescription = "Which programming language do you prefer for blockchain development?";
  const startTime = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
  const endTime = startTime + 3600; // End in 1 hour
  const options = ["Solidity", "Rust", "JavaScript", "Python"];

  const createTx = await votingContract.connect(owner).createPoll(
    pollTitle,
    pollDescription,
    startTime,
    endTime,
    options
  );
  await createTx.wait();
  console.log("Poll created successfully!");

  // Wait for poll to start
  console.log("\n2. Waiting for poll to start...");
  await new Promise(resolve => setTimeout(resolve, 65000)); // Wait 65 seconds

  // Get poll info
  const pollInfo = await votingContract.getPollInfo(1);
  console.log("Poll Info:");
  console.log("- Title:", pollInfo.title);
  console.log("- Description:", pollInfo.description);
  console.log("- Options:", pollInfo.options);
  console.log("- Is Active:", pollInfo.isActive);

  // Cast votes
  console.log("\n3. Casting votes...");
  
  // Voter 1 votes for Solidity
  const vote1Tx = await votingContract.connect(voter1).vote(1, 0);
  await vote1Tx.wait();
  console.log("Voter 1 voted for Solidity");

  // Voter 2 votes for Rust
  const vote2Tx = await votingContract.connect(voter2).vote(1, 1);
  await vote2Tx.wait();
  console.log("Voter 2 voted for Rust");

  // Voter 3 votes for Solidity
  const vote3Tx = await votingContract.connect(voter3).vote(1, 0);
  await vote3Tx.wait();
  console.log("Voter 3 voted for Solidity");

  // Check voting status
  console.log("\n4. Checking voting status...");
  const hasVoted1 = await votingContract.hasVoted(1, voter1.address);
  const hasVoted2 = await votingContract.hasVoted(1, voter2.address);
  const hasVoted3 = await votingContract.hasVoted(1, voter3.address);
  
  console.log("Voter 1 has voted:", hasVoted1);
  console.log("Voter 2 has voted:", hasVoted2);
  console.log("Voter 3 has voted:", hasVoted3);

  // Get updated poll info
  const updatedPollInfo = await votingContract.getPollInfo(1);
  console.log("\nUpdated Poll Results:");
  console.log("Total votes:", updatedPollInfo.totalVotes);
  for (let i = 0; i < updatedPollInfo.options.length; i++) {
    console.log(`${updatedPollInfo.options[i]}: ${updatedPollInfo.voteCounts[i]} votes`);
  }

  // Wait for poll to end
  console.log("\n5. Waiting for poll to end...");
  await new Promise(resolve => setTimeout(resolve, 3600000)); // Wait 1 hour

  // End the poll
  console.log("\n6. Ending the poll...");
  const endTx = await votingContract.connect(owner).endPoll(1);
  await endTx.wait();
  console.log("Poll ended successfully!");

  // Get winning option
  const winningOption = await votingContract.getWinningOption(1);
  console.log(`\nWinning option: ${updatedPollInfo.options[winningOption]}`);

  // Get active polls
  console.log("\n7. Getting active polls...");
  const activePolls = await votingContract.getActivePolls();
  console.log("Active polls:", activePolls);

  console.log("\n=== Demo completed successfully! ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
