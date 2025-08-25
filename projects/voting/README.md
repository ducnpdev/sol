# Decentralized Voting System

A complete decentralized voting system built with Solidity smart contracts and React frontend.

## Features

- **Secure Voting**: One vote per address per poll
- **Time-based Polls**: Set start and end times for polls
- **Real-time Results**: Live vote counting and percentage display
- **Owner Controls**: Only contract owner can create and end polls
- **Modern UI**: Beautiful React frontend with Tailwind CSS
- **Wallet Integration**: MetaMask wallet connection
- **Comprehensive Testing**: Full test coverage for all contract functions

## Smart Contract Features

### VotingContract.sol
- **Poll Creation**: Create polls with title, description, options, and time limits
- **Voting**: Cast votes on active polls (one vote per address)
- **Poll Management**: End polls and determine winners
- **Query Functions**: Get poll info, voting status, and active polls
- **Security**: Reentrancy protection and access control

## Project Structure

```
projects/voting/
├── contracts/
│   └── VotingContract.sol          # Main voting smart contract
├── scripts/
│   ├── deploy.js                   # Contract deployment script
│   └── interact.js                 # Contract interaction demo
├── test/
│   └── VotingContract.test.js      # Comprehensive test suite
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.js    # MetaMask connection
│   │   │   ├── PollList.js         # Poll listing and management
│   │   │   ├── PollCard.js         # Individual poll display
│   │   │   └── CreatePoll.js       # Poll creation form
│   │   ├── contracts/
│   │   │   └── VotingContractABI.js # Contract ABI
│   │   ├── App.js                  # Main application component
│   │   └── index.js                # React entry point
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
└── README.md                       # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension
- Hardhat development environment

### Installation

1. **Install Dependencies**
   ```bash
   # Install Hardhat and contract dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

2. **Deploy the Contract**
   ```bash
   # From the project root
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Update Contract Address**
   - Copy the deployed contract address
   - Update `CONTRACT_ADDRESS` in `frontend/src/App.js`
   - Or set `REACT_APP_CONTRACT_ADDRESS` environment variable

4. **Start the Frontend**
   ```bash
   cd frontend
   npm start
   ```

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run tests with coverage
npx hardhat coverage
```

### Running Scripts

```bash
# Deploy contract
npx hardhat run scripts/deploy.js --network <network>

# Run interaction demo
npx hardhat run scripts/interact.js --network <network>
```

## Usage

### For Poll Owners (Contract Owner)

1. **Connect Wallet**: Connect MetaMask with the owner account
2. **Create Poll**: Navigate to "Create Poll" tab
3. **Fill Details**: Enter title, description, start/end times, and options
4. **Deploy**: Submit the transaction to create the poll
5. **End Poll**: Once the poll ends, click "End Poll" to finalize results

### For Voters

1. **Connect Wallet**: Connect MetaMask with any account
2. **Browse Polls**: View active, upcoming, and ended polls
3. **Vote**: Click "Vote" on any active poll option
4. **View Results**: See real-time vote counts and percentages
5. **Check Status**: See if you've already voted in each poll

## Smart Contract Functions

### Owner Functions
- `createPoll(title, description, startTime, endTime, options)` - Create a new poll
- `endPoll(pollId)` - End a poll and determine the winner

### Public Functions
- `vote(pollId, optionId)` - Cast a vote on an active poll
- `getPollInfo(pollId)` - Get complete poll information
- `hasVoted(pollId, voter)` - Check if an address has voted
- `getActivePolls()` - Get list of currently active polls
- `getWinningOption(pollId)` - Get the winning option for ended polls

## Security Features

- **Access Control**: Only owner can create and end polls
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Time Validation**: Ensures polls start in the future and end after start
- **Vote Validation**: Prevents double voting and invalid options
- **Input Validation**: Validates all user inputs

## Frontend Features

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Automatically refreshes poll data
- **Wallet Integration**: Seamless MetaMask connection
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback for transactions
- **Progress Bars**: Visual representation of vote percentages

## Testing

The project includes comprehensive tests covering:

- Contract deployment
- Poll creation and validation
- Voting functionality
- Poll management
- Access control
- Error conditions
- Edge cases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the repository.
