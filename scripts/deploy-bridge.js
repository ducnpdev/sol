async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const tokenAddress = "0x4D2c45779c89103c76Ae9cF5FE5596007a6cf815"; // ERC20 BANKVN token address
  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(tokenAddress);

  console.log("Bridge contract deployed to:", bridge.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
