// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";

import {ContractA} from '../src/counter/ContractA.sol';
import {ContractB} from '../src/counter/ContractB.sol';

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract UpgradesScript is Script {
      function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy `ContractA` as a transparent proxy using the Upgrades Plugin
        address transparentProxy = Upgrades.deployTransparentProxy(
            "ContractA.sol",
            msg.sender,
            abi.encodeCall(ContractA.initialize, 10)
        );

    }
}

