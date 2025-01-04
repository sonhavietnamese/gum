// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";
import {Items1155Central} from "../src/central/Items1155Central.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract Items1155CentralScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the CurrencyCentral implementation contract
        Items1155Central items1155Central = new Items1155Central();

        // Deploy the ProxyAdmin contract
        ProxyAdmin proxyAdmin = new ProxyAdmin(owner);

        // Deploy the TransparentUpgradeableProxy with the implementation and ProxyAdmin
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(items1155Central),
            address(proxyAdmin),
            abi.encodeWithSelector(Items1155Central.initialize.selector, owner)
        );

        console2.log("Proxy address:", address(proxy));
        console2.log("Implementation address:", address(items1155Central));
        console2.log("ProxyAdmin address:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
