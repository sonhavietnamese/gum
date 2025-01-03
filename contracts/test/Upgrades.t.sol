// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "openzeppelin-foundry-upgrades/Upgrades.sol";
import "../src/counter/ContractA.sol";
import "../src/counter/ContractB.sol";

contract UpgradesTest is Test {
    function testTransparent() public {
        // Deploy a transparent proxy with ContractA as the implementation and initialize it with 10
        address proxy =
            Upgrades.deployTransparentProxy("ContractA.sol", msg.sender, abi.encodeCall(ContractA.initialize, (10)));

        // Get the instance of the contract
        ContractA instance = ContractA(proxy);

        // Get the implementation address of the proxy
        address implAddrV1 = Upgrades.getImplementationAddress(proxy);

        // Get the admin address of the proxy
        address adminAddr = Upgrades.getAdminAddress(proxy);

        // Ensure the admin address is valid
        assertFalse(adminAddr == address(0));

        // Log the initial value
        console.log("----------------------------------");
        console.log("Value before upgrade --> ", instance.value());
        console.log("----------------------------------");

        // Verify initial value is as expected
        assertEq(instance.value(), 10);

        // Upgrade the proxy to ContractB
        Upgrades.upgradeProxy(proxy, "ContractB.sol", "", msg.sender);

        // Get the new implementation address after upgrade
        address implAddrV2 = Upgrades.getImplementationAddress(proxy);

        // Verify admin address remains unchanged
        assertEq(Upgrades.getAdminAddress(proxy), adminAddr);

        // Verify implementation address has changed
        assertFalse(implAddrV1 == implAddrV2);

        // Invoke the increaseValue function separately
        ContractB(address(instance)).increaseValue();

        // Log and verify the updated value
        console.log("----------------------------------");
        console.log("Value after upgrade --> ", instance.value());
        console.log("----------------------------------");
        assertEq(instance.value(), 20);
    }
}
