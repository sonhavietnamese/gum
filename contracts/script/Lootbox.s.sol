// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {Lootbox} from "../src/lootbox/Lootbox.sol";

contract LootboxScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the Lootbox contract
        Lootbox lootbox = new Lootbox();
        
        vm.stopBroadcast();
    }
}
