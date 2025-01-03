// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20PausableUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import {ERC20PermitUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {Currency} from "../currency/Currency.sol";

// Factory contract
contract CurrencyCentral is Initializable {
    address private _implementation;
    ProxyAdmin private _proxyAdmin;

    event CurrencyCreated(address indexed currencyAddress, string name, string symbol, address owner);

    mapping(address => address[]) private _userCurrencies;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner) external initializer {
        Currency tokenImpl = new Currency();
        _implementation = address(tokenImpl);

        _proxyAdmin = new ProxyAdmin(owner);
    }

    function implementation() external view returns (address) {
        return _implementation;
    }

    function proxyAdmin() external view returns (ProxyAdmin) {
        return _proxyAdmin;
    }

    function createCurrency(
        string memory name,
        string memory symbol,
        address defaultAdmin,
        address pauser,
        address minter
    ) external returns (address) {
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            Currency(_implementation).initialize.selector, defaultAdmin, pauser, minter, name, symbol
        );

        // // Deploy proxy
        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(_implementation, address(_proxyAdmin), initData);

        // Store token address for the user
        _userCurrencies[defaultAdmin].push(address(proxy));

        emit CurrencyCreated(address(proxy), name, symbol, defaultAdmin);

        return address(proxy);
    }

    function getUserCurrencies(address user) external view returns (address[] memory) {
        return _userCurrencies[user];
    }
}
