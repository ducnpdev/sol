const hre = require("hardhat");

async function main() {
  // Get the deployed contract address (you can replace this with the actual address from deployment)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get the contract factory
  const Counter = await hre.ethers.getContractFactory("Counter");
  
  // Attach to the deployed contract
  const counter = Counter.attach(contractAddress);
  
  console.log("Interacting with Counter contract at:", contractAddress);
  
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
