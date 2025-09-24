require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const { SEPOLIA_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

// Only add sepolia configuration if required env vars are present
if (SEPOLIA_URL && PRIVATE_KEY) {
  config.networks.sepolia = {
    url: SEPOLIA_URL,
    accounts: [PRIVATE_KEY]
  };
}

module.exports = config;
