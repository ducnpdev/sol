# Voting System Setup Instructions

## 🚀 Quick Setup Guide

### 1. Start the Hardhat Node
```bash
npx hardhat node
```
This will start a local blockchain at `http://localhost:8545`

### 2. Deploy the Contract
```bash
npx hardhat run projects/voting/scripts/deploy.js --network localhost
```

### 3. Start the Frontend
```bash
cd projects/voting/frontend
npm start
```

### 4. Configure MetaMask

1. **Open MetaMask** and click on the network dropdown
2. **Add Network** → **Add Network Manually**
3. **Network Settings:**
   - Network Name: `Hardhat Local`
   - New RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
   - Block Explorer URL: (leave empty)

### 5. Import Test Account

From the Hardhat node output, copy one of the private keys:
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

1. In MetaMask, click **Import Account**
2. Paste the private key
3. You'll now have 10,000 ETH to use

### 6. Connect to the Voting App

1. Go to `http://localhost:3000`
2. Click **Connect MetaMask**
3. Approve the connection
4. You should now see the voting interface!

## 🔧 Troubleshooting

### "Failed to load polls" Error
- Make sure Hardhat node is running
- Make sure you're connected to the correct network (Chain ID: 1337)
- Try refreshing the page

### Contract Connection Issues
- Verify the contract is deployed: `npx hardhat run projects/voting/scripts/test-connection.js --network localhost`
- Check that MetaMask is connected to `http://localhost:8545`

### Frontend Won't Start
- Make sure you're in the frontend directory: `cd projects/voting/frontend`
- Install dependencies: `npm install`
- Start the server: `npm start`

## 📝 Contract Address
The voting contract is deployed at: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

## 🎯 Ready to Vote!
Once everything is set up, you can:
- Create polls (if you're the contract owner)
- Vote on active polls
- View real-time results
- See poll history
