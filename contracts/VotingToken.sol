// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingToken is ERC20, Ownable {
    constructor() ERC20("Voting Token", "VOTE") Ownable(msg.sender) {
        // Mint initial supply to the owner
        _mint(msg.sender, 1000000 * 10**decimals()); // 1 million tokens
    }

    // Function to mint tokens (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Function to distribute tokens to voters
    function distributeToVoters(address[] calldata voters, uint256 amount) external onlyOwner {
        for (uint256 i = 0; i < voters.length; i++) {
            _mint(voters[i], amount);
        }
    }
}
