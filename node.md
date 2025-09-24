Failed to connect to contract. Please make sure you're connected to the Hardhat Local network (Chain ID: 1337)
-> 

- curl test node:
```json
sleep 3 && curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545
```
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545

# Deploy Test Net Sepolia
## deploy test net sepolia
- npx hardhat compile
- npx hardhat run projects/voting/scripts/deploy-voting-builtin.js --network sepolia
    ```
    Deploying VotingToken contract...
    VotingToken deployed to: 0xA8db0f4bcDe2579624Aeb571A4e40095Ad3936C8
    Deploying VotingContract...
    VotingContract deployed to: 0xE2fCff1B37eea816A7BE70B96e900d1fD810ED58
    Deployer address: 0xA7cF451F98b565dfd15274A90B502a74F59008f0

    Testing contract connection...
    Contract owner: 0xA7cF451F98b565dfd15274A90B502a74F59008f0
    Token name: Voting Token
    Token symbol: VOTE

    Deployment successful! Use these addresses in your frontend:
    VotingToken: 0xA8db0f4bcDe2579624Aeb571A4e40095Ad3936C8
    VotingContract: 0xE2fCff1B37eea816A7BE70B96e900d1fD810ED58
    ```