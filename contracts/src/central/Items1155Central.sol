// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {Items1155} from "../items/Items1155.sol";

contract Items1155Central is Initializable {
    address private _implementation;
    ProxyAdmin private _proxyAdmin;

    event ItemsCollectionCreated(address indexed collectionAddress, address owner);

    mapping(address => address[]) private _userCollections;
    mapping(string => address[]) private _gameCollections;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner) external initializer {
        Items1155 itemsImpl = new Items1155();
        _implementation = address(itemsImpl);

        _proxyAdmin = new ProxyAdmin(owner);
    }

    function implementation() external view returns (address) {
        return _implementation;
    }

    function proxyAdmin() external view returns (ProxyAdmin) {
        return _proxyAdmin;
    }

    function createCollection(
        address defaultAdmin,
        address pauser,
        address minter,
        string memory gameSlug
    ) external returns (address) {
        bytes memory initData = abi.encodeWithSelector(
            Items1155(_implementation).initialize.selector,
            defaultAdmin,
            pauser,
            minter
        );

        TransparentUpgradeableProxy proxy = 
            new TransparentUpgradeableProxy(_implementation, address(_proxyAdmin), initData);

        _userCollections[defaultAdmin].push(address(proxy));
        _gameCollections[gameSlug].push(address(proxy));

        emit ItemsCollectionCreated(address(proxy), defaultAdmin);

        return address(proxy);
    }

    function getUserCollections(address user) external view returns (address[] memory) {
        return _userCollections[user];
    }

    function getGameCollections(string memory gameSlug) external view returns (address[] memory) {
        return _gameCollections[gameSlug];
    }

    function getWalletGameCollections(address wallet, string memory gameSlug) 
        external 
        view 
        returns (address[] memory) 
    {
        address[] memory userCollections = _userCollections[wallet];
        address[] memory gameCollections = _gameCollections[gameSlug];

        uint256 matchCount = 0;
        for (uint256 i = 0; i < userCollections.length; i++) {
            for (uint256 j = 0; j < gameCollections.length; j++) {
                if (userCollections[i] == gameCollections[j]) {
                    matchCount++;
                }
            }
        }

        address[] memory result = new address[](matchCount);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < userCollections.length; i++) {
            for (uint256 j = 0; j < gameCollections.length; j++) {
                if (userCollections[i] == gameCollections[j]) {
                    result[resultIndex] = userCollections[i];
                    resultIndex++;
                }
            }
        }

        return result;
    }
}