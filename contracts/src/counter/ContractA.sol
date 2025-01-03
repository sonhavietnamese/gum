// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ContractA is Initializable {
    uint256 public value;

    function initialize(uint256 _setValue) public initializer {
        value = _setValue;
    }
}
