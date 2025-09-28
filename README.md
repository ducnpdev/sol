# Smart Contract Bridge

A decentralized bridge system for BankVN token deposits and withdrawals using Solidity smart contracts.

## Prerequisites

- Node.js (v16 or higher)
- npm package manager
- Ethereum wallet with Sepolia testnet ETH

## Project Structure

```
godev-solidity/
├── contracts/
│   ├── BankVNToken.sol              # ERC20 token contract
│   ├── Bridge.sol                   # Bridge contract for deposits/withdrawals
│   └── Counter.sol                  # Example contract
├── scripts/
│   ├── deploy-bankvntoken.js        # Deploy BankVN token
│   ├── deploy-bridge.js             # Deploy bridge contract
│   └── deploy.js                    # General deployment
├── test/
│   ├── BankVNBridge.test.js     # Bridge tests (25 test cases)
│   └── Counter.test.js              # Example tests
├── docs/
│   └── deployment/
│       └── DEVELOPMENT_GUIDE.md     # Complete setup & deployment guide
├── hardhat.config.js                # Hardhat configuration
└── package.json                     # Dependencies
```

## Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests (25/25 passing)
npm run test
```

## Complete Setup & Deployment

For detailed instructions including environment setup, contract deployment, testing, and verification:

**📖 [Development Guide](docs/deployment/DEVELOPMENT_GUIDE.md)**

The guide covers:

- Environment configuration (.env setup)
- Step-by-step contract deployment to Sepolia
- Contract verification on Etherscan
- Complete testing procedures
- Troubleshooting common issues

## Contracts

### BankVNToken

- ERC20 token with 1M initial supply
- Mint/burn functionality
- Deployed: `0x4D2c45779c89103c76Ae9cF5FE5596007a6cf815` (Sepolia)

### Bridge

- Secure token deposits with user ID tracking
- Owner-only withdrawals
- Gas optimized: ~63k gas (deposit), ~43k gas (withdraw)

## Available Scripts

```bash
npm run compile              # Compile contracts
npm run test                # Run all tests
npm run node                # Start local network

# Deployment (see Development Guide for setup)
npx hardhat run scripts/deploy-bankvntoken.js --network sepolia
npx hardhat run scripts/deploy-bridge.js --network sepolia
```

## Testing

- 25/25 test cases passing
- Full coverage: deposits, withdrawals, security, gas optimization
- Run with: `npm run test`

## License

ISC
