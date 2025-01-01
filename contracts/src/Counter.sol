// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

contract Counter {
    uint256 private count;

    constructor() {
        count = 0;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        require(count > 0, "Counter: decrement overflow");
        count -= 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
