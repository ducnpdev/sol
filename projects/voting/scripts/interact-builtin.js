const hre = require("hardhat");

async function main() {
  // Deploy the contract first on the built-in network
  console.log("Deploying Counter contract...");
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  
  console.log("Counter deployed to:", await counter.getAddress());
  
  // Get initial count
  let count = await counter.getCount();
  console.log("Initial count:", count.toString());
  
  // Increment the counter
  console.log("\nIncrementing counter...");
  const incrementTx = await counter.increment();
  await incrementTx.wait();
  
  count = await counter.getCount();
  console.log("Count after increment:", count.toString());
  
  // Increment again
  console.log("\nIncrementing counter again...");
  const incrementTx2 = await counter.increment();
  await incrementTx2.wait();
  
  count = await counter.getCount();
  console.log("Count after second increment:", count.toString());
  
  // Decrement the counter
  console.log("\nDecrementing counter...");
  const decrementTx = await counter.decrement();
  await decrementTx.wait();
  
  count = await counter.getCount();
  console.log("Count after decrement:", count.toString());
  
  // Reset the counter
  console.log("\nResetting counter...");
  const resetTx = await counter.reset();
  await resetTx.wait();
  
  count = await counter.getCount();
  console.log("Count after reset:", count.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
