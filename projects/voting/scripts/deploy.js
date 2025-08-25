const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VotingContract...");

  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();
  await votingContract.waitForDeployment();

  const address = await votingContract.getAddress();
  console.log("VotingContract deployed to:", address);
  
  // Verify the deployment
  console.log("Deployment successful!");
  console.log("Contract address:", address);
  console.log("Owner:", await votingContract.owner());
  
  return votingContract;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
