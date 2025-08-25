const hre = require("hardhat");

async function main() {
  // Deploy the VotingToken first
  console.log("Deploying VotingToken contract...");
  const VotingToken = await hre.ethers.getContractFactory("VotingToken");
  const votingToken = await VotingToken.deploy();
  await votingToken.waitForDeployment();
  
  console.log("VotingToken deployed to:", await votingToken.getAddress());
  
  // Deploy the VotingContract
  console.log("Deploying VotingContract...");
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();
  await votingContract.waitForDeployment();
  
  console.log("VotingContract deployed to:", await votingContract.getAddress());
  
  // Get the signer to check owner
  const [signer] = await hre.ethers.getSigners();
  console.log("Deployer address:", signer.address);
  
  // Test basic contract functions
  console.log("\nTesting contract connection...");
  const owner = await votingContract.owner();
  console.log("Contract owner:", owner);
  
  // Test token functions
  const tokenName = await votingToken.name();
  const tokenSymbol = await votingToken.symbol();
  console.log("Token name:", tokenName);
  console.log("Token symbol:", tokenSymbol);
  
  console.log("\nDeployment successful! Use these addresses in your frontend:");
  console.log("VotingToken:", await votingToken.getAddress());
  console.log("VotingContract:", await votingContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
