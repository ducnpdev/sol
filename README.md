# Solidity Development Project

This is a Solidity development project set up with Hardhat, a popular Ethereum development environment.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Project Structure

```
godev-solidity/
├── contracts/          # Solidity smart contracts
│   └── Counter.sol     # Example counter contract
├── scripts/            # Deployment and utility scripts
│   └── deploy.js       # Contract deployment script
├── test/               # Test files
│   └── Counter.test.js # Tests for Counter contract
├── hardhat.config.js   # Hardhat configuration
├── package.json        # Project dependencies
└── README.md          # This file
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Run Tests
```bash
npm run test
```

### 4. Start Local Blockchain
```bash
npm run node
```

### 5. Deploy Contracts
In a new terminal, after starting the local blockchain:
```bash
npm run deploy:local
```

## Available Scripts

- `npm run compile` - Compile all Solidity contracts
- `npm run test` - Run all tests
- `npm run deploy` - Deploy contracts to default network
- `npm run deploy:local` - Deploy contracts to local network
- `npm run interact` - Interact with deployed contract (requires local network)
- `npm run node` - Start local Hardhat network
- `npm run clean` - Clean build artifacts

## Example Contract

The project includes a simple `Counter` contract that demonstrates:

- State variables
- Functions (public, view)
- Events
- Error handling with `require`
- Constructor

### Counter Contract Functions

- `increment()` - Increases the counter by 1
- `decrement()` - Decreases the counter by 1 (reverts if below 0)
- `getCount()` - Returns the current count
- `reset()` - Resets the counter to 0

## Development Workflow

1. Write your Solidity contracts in the `contracts/` directory
2. Write tests in the `test/` directory
3. Run tests to ensure your contracts work correctly
4. Deploy contracts using the scripts in `scripts/`
5. Interact with deployed contracts

## Hardhat Features

This project includes the Hardhat Toolbox which provides:

- **Ethers.js** - Ethereum library for interacting with contracts
- **Chai** - Testing framework
- **Gas Reporter** - Gas usage reporting
- **TypeChain** - TypeScript bindings generation
- **Solidity Coverage** - Code coverage for Solidity
- **Hardhat Ignition** - Deployment management

## Next Steps

1. Explore the `Counter.sol` contract to understand Solidity syntax
2. Modify the contract or create new ones
3. Write comprehensive tests
4. Learn about different networks and deployment strategies
5. Explore advanced Hardhat features

## Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/) - Popular smart contract library
