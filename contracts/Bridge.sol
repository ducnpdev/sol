// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);
}

contract Bridge {
    IERC20 public bankToken; // Token ERC20 (BANKVN)
    address public owner;

    event Deposited(address indexed user, uint256 amount, string obpUserId);
    event Withdrawn(address indexed user, uint256 amount, string obpUserId);

    constructor(address tokenAddress) {
        bankToken = IERC20(tokenAddress);
        owner = msg.sender;
    }

    function deposit(uint256 amount, string memory obpUserId) external {
        require(amount > 0, "Amount must be > 0");

        require(
            bankToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        emit Deposited(msg.sender, amount, obpUserId);
    }

    function withdraw(
        address to,
        uint256 amount,
        string memory obpUserId
    ) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount > 0, "Amount must be > 0");

        require(bankToken.transfer(to, amount), "Token transfer failed");

        emit Withdrawn(to, amount, obpUserId);
    }
}
