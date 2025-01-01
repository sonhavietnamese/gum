// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import { Counter } from "../src/Counter.sol";

contract TestCounter is Test {
    Counter c;

    function setUp() public {
        c = new Counter();
    }

    function testIncrement() public {
        c.increment();
        assertEq(c.getCount(), 1, "Counter should be incremented to 1");
    }

    function testDecrement() public {
        c.increment();
        c.decrement();
        assertEq(c.getCount(), 0, "Counter should be decremented to 0");
    }

    function testDecrementUnderflow() public {
        try c.decrement() {
            fail();
        } catch Error(string memory reason) {
            assertEq(reason, "Counter: decrement overflow");
        }
    }

    function testGetCount() public {
        assertEq(c.getCount(), 0, "Initial counter value should be 0");
    }
}
