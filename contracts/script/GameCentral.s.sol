// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {GameCentral} from "../src/central/GameCentral.sol";

contract GameCentralScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GameCentral gameCentral = new GameCentral();

        vm.stopBroadcast();
    }
}
