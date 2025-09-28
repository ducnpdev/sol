# Smart Contract Bridge Development Guide

## Project Overview

This project implements a decentralized bridge system using Solidity smart contracts and Hardhat development framework. The bridge allows users to deposit and withdraw BankVN tokens with proper access controls.

### Architecture

- **BankVNToken**: ERC20 token contract with mint/burn capabilities
- **Bridge**: Bridge contract for token deposit/withdrawal operations
- **Testing**: Comprehensive test suite using Hardhat and Chai
- **Deployment**: Scripts for deploying to various networks

## Prerequisites

### System Requirements

- Node.js version 16 or higher
- npm package manager
- Git

### Network Requirements

- Ethereum wallet (MetaMask recommended)
- Sepolia testnet ETH for deployment
- RPC endpoint (Alchemy, Infura, or QuickNode)

## Environment Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd smart-contract-bridge

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here

# Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Security Note**: Never commit the `.env` file to version control. Ensure it's listed in `.gitignore`.

### 3. Get Sepolia Testnet ETH

For testing deployment, obtain Sepolia ETH from faucets:

- Alchemy Sepolia Faucet: https://sepoliafaucet.com/
- QuickNode Faucet: https://faucet.quicknode.com/ethereum/sepolia
- Chainlink Faucet: https://faucets.chain.link/
- Minning Sepolia Testnet: https://sepolia-faucet.pk910.de/

Minimum required: 0.001 ETH for contract deployment.

## Contract Architecture

### BankVNToken Contract

**File**: `contracts/BankVNToken.sol`

```solidity
contract BankVNToken is ERC20, Ownable {
    constructor() ERC20("Bank VN Token", "BANKVN") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner;
    function burn(uint256 amount) external;
}
```

**Features**:

- Initial supply: 1,000,000 BANKVN tokens
- Owner-controlled minting
- User-controlled burning
- OpenZeppelin ERC20 standard implementation

### Bridge Contract

**File**: `contracts/Bridge.sol`

```solidity
contract Bridge {
    IERC20 public bankToken;
    address public owner;

    function deposit(uint256 amount, string memory obpUserId) external;
    function withdraw(address to, uint256 amount, string memory obpUserId) external;
}
```

**Features**:

- Token deposit functionality with user ID tracking
- Owner-only withdrawal capability
- Event emission for off-chain tracking
- Secure token transfer validation

## Development Workflow

### 1. Compile Contracts

```bash
# Compile all contracts
npx hardhat compile

# Clean previous compilation artifacts
npx hardhat clean && npx hardhat compile
```

### 2. Run Local Development Network

```bash
# Start local Hardhat network
npx hardhat node
```

This creates a local blockchain with 20 pre-funded accounts for testing.

### 3. Run Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/BankVNBridge.test.js

# Run tests with gas reporting
npx hardhat test --gas-report
```

### 4. Test Coverage Analysis

The test suite covers:

- Contract deployment and initialization
- Token deposit functionality
- Owner-only withdrawal operations
- Error handling and edge cases
- Gas optimization verification
- Security validations

Expected output: 25/25 tests passing with gas usage reports.

## Deployment Process

### 1. Deploy BankVN Token

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-bankvntoken.js --network sepolia
```

**Expected Output**:

```
Deploying token with account: 0x...
BankVNToken deployed to: 0x4D2c45779c89103c76Ae9cF5FE5596007a6cf815
```

### 2. Deploy Bridge Contract

Update the token address in `scripts/deploy-bridge.js`:

```javascript
const tokenAddress = "0x4D2c45779c89103c76Ae9cF5FE5596007a6cf815"; // Replace with actual token address
```

Deploy the bridge:

```bash
npx hardhat run scripts/deploy-bridge.js --network sepolia
```

### 3. Verify Contracts on Etherscan

```bash
# Verify BankVN Token
npx hardhat verify --network sepolia <TOKEN_ADDRESS>

# Verify Bridge Contract
npx hardhat verify --network sepolia <BRIDGE_ADDRESS> <TOKEN_ADDRESS>
```

## Contract Interaction

### 1. Token Operations

```javascript
// Get token contract instance
const token = await ethers.getContractAt("BankVNToken", tokenAddress);

// Check balance
const balance = await token.balanceOf(userAddress);
console.log("Balance:", ethers.formatEther(balance));

// Approve bridge to spend tokens
await token.approve(bridgeAddress, amount);

// Mint new tokens (owner only)
await token.mint(userAddress, amount);
```

### 2. Bridge Operations

```javascript
// Get bridge contract instance
const bridge = await ethers.getContractAt("Bridge", bridgeAddress);

// Deposit tokens
await bridge.deposit(amount, "user_id_123");

// Withdraw tokens (owner only)
await bridge.withdraw(userAddress, amount, "user_id_123");
```

## Testing Guide

### Local Testing

```bash
# Start local network
npx hardhat node

# In separate terminal, run tests
npx hardhat test --network localhost
```

### Testnet Testing

After deployment to Sepolia:

1. **Verify Contract Deployment**:

   - Check contract addresses on Sepolia Etherscan
   - Verify contract source code

2. **Test Token Operations**:

   - Transfer tokens between accounts
   - Approve bridge contract for spending
   - Test mint/burn functionality

3. **Test Bridge Operations**:
   - Deposit tokens to bridge
   - Verify events are emitted correctly
   - Test withdrawal by owner

## Security Considerations

### Access Control

- Bridge contract uses owner-only withdrawal pattern
- Token contract implements OpenZeppelin Ownable for mint operations
- No reentrancy vulnerabilities in current implementation

### Token Security

- ERC20 standard compliance through OpenZeppelin
- Proper allowance and balance checks
- Safe transfer implementations

### Bridge Security

- Input validation for zero amounts
- Proper error handling for failed transfers
- Event emission for transaction tracking

## Gas Optimization

Based on test results:

- **Token Deposit**: ~63,000 gas
- **Token Withdrawal**: ~43,000 gas

### Optimization Strategies

- Minimal storage operations
- Efficient event emission
- Direct ERC20 interface usage
- No unnecessary computations

## Troubleshooting

### Common Deployment Issues

**1. Insufficient Funds Error**

```
Error: insufficient funds for gas * price + value
```

Solution: Add more Sepolia ETH to deployer account.

**2. Network Connection Issues**

```
Error: could not detect network
```

Solution: Verify RPC URL in `.env` file and network connectivity.

**3. Contract Verification Failures**

```
Error: contract verification failed
```

Solution: Ensure contract source matches deployed bytecode and constructor arguments are correct.

### Testing Issues

**1. Test Failures with Custom Errors**

```
AssertionError: Expected transaction to be reverted with reason 'message'
```

Solution: Use `.to.be.reverted` instead of `.to.be.revertedWith()` for OpenZeppelin custom errors.

**2. Network Configuration Problems**

```
Error: could not resolve name
```

Solution: Verify network configuration in `hardhat.config.js` matches `.env` settings.

## Project Structure

```
smart-contract-bridge/
├── contracts/
│   ├── BankVNToken.sol          # ERC20 token implementation
│   ├── Bridge.sol               # Bridge contract
│   ├── Counter.sol              # Example contract
│   └── VotingContract.sol       # Voting system contract
├── scripts/
│   ├── deploy-bankvntoken.js    # Token deployment script
│   ├── deploy-bridge.js         # Bridge deployment script
│   ├── deploy.js               # General deployment script
│   └── interact.js             # Contract interaction examples
├── test/
│   ├── BankVNBridge.test.js    # Comprehensive bridge tests
│   └── Counter.test.js         # Example tests
├── .env.example                # Environment variables template
├── hardhat.config.js          # Hardhat configuration
└── package.json              # Node.js dependencies
```

## Available Scripts

```bash
# Development
npm run compile              # Compile contracts
npm run test                # Run all tests
npm run node                # Start local network

# Deployment
npm run deploy              # Deploy to local network
npm run deploy:local        # Deploy to localhost
npm run interact            # Run interaction script

# Utility
npm run clean               # Clean compilation artifacts
```

## Contract Addresses (Sepolia Testnet)

Based on successful deployment:

- **BankVNToken**: `0x4D2c45779c89103c76Ae9cF5FE5596007a6cf815`
- **Bridge**: `0x2823a1F5265b6fF8A160D4b3bd4B86F11d0A3AdA`

## API Reference

### BankVNToken Contract

**Functions**:

- `name()` → `string`: Returns "Bank VN Token"
- `symbol()` → `string`: Returns "BANKVN"
- `totalSupply()` → `uint256`: Returns total token supply
- `balanceOf(address account)` → `uint256`: Returns account balance
- `mint(address to, uint256 amount)`: Mint tokens (owner only)
- `burn(uint256 amount)`: Burn caller's tokens

### Bridge Contract

**Functions**:

- `bankToken()` → `address`: Returns token contract address
- `owner()` → `address`: Returns bridge owner
- `deposit(uint256 amount, string obpUserId)`: Deposit tokens to bridge
- `withdraw(address to, uint256 amount, string obpUserId)`: Withdraw tokens (owner only)

**Events**:

- `Deposited(address indexed user, uint256 amount, string obpUserId)`
- `Withdrawn(address indexed user, uint256 amount, string obpUserId)`

## License

This project is licensed under the ISC License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review test outputs for error details
3. Verify network configuration and environment variables
4. Ensure sufficient testnet ETH for operations
