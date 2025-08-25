Failed to connect to contract. Please make sure you're connected to the Hardhat Local network (Chain ID: 1337)
-> 

- curl test node:
```json
sleep 3 && curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545
```