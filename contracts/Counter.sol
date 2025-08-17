// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 private _count;
    
    event CountIncremented(uint256 newCount);
    event CountDecremented(uint256 newCount);
    
    constructor() {
        _count = 0;
    }
    
    function increment() public {
        _count++;
        emit CountIncremented(_count);
    }
    
    function decrement() public {
        require(_count > 0, "Counter: cannot decrement below zero");
        _count--;
        emit CountDecremented(_count);
    }
    
    function getCount() public view returns (uint256) {
        return _count;
    }
    
    function reset() public {
        _count = 0;
        emit CountIncremented(_count);
    }
}
