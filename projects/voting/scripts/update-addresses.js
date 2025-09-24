const fs = require('fs');
const path = require('path');

async function main() {
  console.log("=== Updating Script Addresses ===\n");

  try {
    // Read deployed addresses
    if (!fs.existsSync('deployed-addresses.json')) {
      console.log("❌ 'deployed-addresses.json' not found. Please run 'deploy-all.js' first.");
      return;
    }

    const addresses = JSON.parse(fs.readFileSync('deployed-addresses.json', 'utf8'));
    console.log("📋 Deployed Addresses:");
    console.log("Token:", addresses.token);
    console.log("Contract:", addresses.contract);
    console.log("Owner:", addresses.owner);

    // List of script files to update
    const scriptFiles = [
      'scripts/setup-multi-user-accounts.js',
      'scripts/test-multi-user-voting.js',
      'scripts/create-and-test-multi-user-poll.js',
      'scripts/quick-multi-user-test.js',
      'scripts/create-poll-and-vote-multi.js'
    ];

    console.log("\n🔄 Updating script files...");
    console.log("=====================================");

    for (const scriptFile of scriptFiles) {
      if (fs.existsSync(scriptFile)) {
        console.log(`\n📝 Updating ${scriptFile}...`);
        
        let content = fs.readFileSync(scriptFile, 'utf8');
        
        // Update token address
        content = content.replace(
          /const tokenAddress = "[^"]*";/g,
          `const tokenAddress = "${addresses.token}";`
        );
        
        // Update contract address
        content = content.replace(
          /const contractAddress = "[^"]*";/g,
          `const contractAddress = "${addresses.contract}";`
        );
        
        // Write updated content
        fs.writeFileSync(scriptFile, content);
        console.log(`   ✅ Updated ${scriptFile}`);
        
      } else {
        console.log(`   ⚠️  File not found: ${scriptFile}`);
      }
    }

    console.log("\n🎉 All script addresses updated successfully!");
    console.log("\n📝 You can now run:");
    console.log("1. npx hardhat run scripts/setup-multi-user-accounts.js --network localhost");
    console.log("2. npx hardhat run scripts/quick-multi-user-test.js --network localhost");
    console.log("3. npx hardhat run scripts/create-poll-and-vote-multi.js --network localhost");

  } catch (error) {
    console.error("\n❌ Error updating addresses:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
