// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";
import {Items721Central} from "../src/central/Items721Central.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract Items721CentralScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the CurrencyCentral implementation contract
        Items721Central items721Central = new Items721Central();

        // Deploy the ProxyAdmin contract
        ProxyAdmin proxyAdmin = new ProxyAdmin(admin);

        // Deploy the TransparentUpgradeableProxy with the implementation and ProxyAdmin
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(items721Central),
            address(proxyAdmin),
            abi.encodeWithSelector(Items721Central.initialize.selector, admin)
        );

        console2.log("Proxy address:", address(proxy));
        console2.log("Implementation address:", address(items721Central));
        console2.log("ProxyAdmin address:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
