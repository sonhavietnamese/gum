// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script, console2} from "forge-std/Script.sol";
import {CurrencyCentral} from "../src/central/CurrencyCentral.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract CurrencyCentralScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the CurrencyCentral implementation contract
        CurrencyCentral currencyCentral = new CurrencyCentral();

        // Deploy the ProxyAdmin contract
        ProxyAdmin proxyAdmin = new ProxyAdmin(admin);

        // Deploy the TransparentUpgradeableProxy with the implementation and ProxyAdmin
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(currencyCentral),
            address(proxyAdmin),
            abi.encodeWithSelector(CurrencyCentral.initialize.selector, admin)
        );

        console2.log("Proxy address:", address(proxy));
        console2.log("Implementation address:", address(currencyCentral));
        console2.log("ProxyAdmin address:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
