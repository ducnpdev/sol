const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying token with account:", deployer.address);

  const Token = await hre.ethers.getContractFactory("BankVNToken");
  const token = await Token.deploy();

  await token.waitForDeployment();

  console.log("BankVNToken deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
