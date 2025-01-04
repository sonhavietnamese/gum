// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test, console2} from "forge-std/Test.sol";
import {Items721Central} from "../src/central/Items721Central.sol";
import {Items721} from "../src/items/Items721.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract Items721CentralTest is Test {
    Items721Central public central;
    address public owner;
    address public admin;
    address public pauser;
    address public minter;
    string public constant GAME_SLUG = "test-game";

    event ItemsCollectionCreated(address indexed collectionAddress, address owner);

    function setUp() public {
        owner = makeAddr("owner");
        admin = makeAddr("admin");
        pauser = makeAddr("pauser");
        minter = makeAddr("minter");

        vm.startPrank(owner);
        address proxy = Upgrades.deployTransparentProxy(
            "Items721Central.sol", msg.sender, abi.encodeCall(Items721Central.initialize, (owner))
        );
        central = Items721Central(proxy);
        vm.stopPrank();
    }

    function test_Initialize() public {
        assertNotEq(address(central.implementation()), address(0));
        assertNotEq(address(central.proxyAdmin()), address(0));
    }

    function test_GetUserCollections() public {
        address collection1 = central.createCollection(admin, pauser, minter, GAME_SLUG);
        address collection2 = central.createCollection(admin, pauser, minter, GAME_SLUG);

        address[] memory collections = central.getUserCollections(admin);
        assertEq(collections.length, 2);
        assertEq(collections[0], collection1);
        assertEq(collections[1], collection2);
    }

    function test_GetGameCollections() public {
        address collection1 = central.createCollection(admin, pauser, minter, GAME_SLUG);
        address collection2 = central.createCollection(admin, pauser, minter, GAME_SLUG);

        address[] memory collections = central.getGameCollections(GAME_SLUG);
        assertEq(collections.length, 2);
        assertEq(collections[0], collection1);
        assertEq(collections[1], collection2);
    }

    function test_GetWalletGameCollections() public {
        string memory otherGame = "other-game";
        
        // Create collections for test game
        address collection1 = central.createCollection(admin, pauser, minter, GAME_SLUG);
        address collection2 = central.createCollection(admin, pauser, minter, GAME_SLUG);
        
        // Create collection for other game
        central.createCollection(admin, pauser, minter, otherGame);

        // Get collections for admin wallet in test game
        address[] memory collections = central.getWalletGameCollections(admin, GAME_SLUG);
        
        assertEq(collections.length, 2);
        assertEq(collections[0], collection1);
        assertEq(collections[1], collection2);
    }

    function test_CollectionFunctionality() public {
        address collection = central.createCollection(admin, pauser, minter, GAME_SLUG);
        Items721 items = Items721(collection);

        // Test minting
        vm.startPrank(minter);
        items.safeMint(admin, "ipfs://test-uri");
        assertEq(items.ownerOf(0), admin);
        assertEq(items.tokenURI(0), "ipfs://test-uri");
        vm.stopPrank();

        // Test pausing
        vm.startPrank(pauser);
        items.pause();
        assertTrue(items.paused());
        items.unpause();
        assertFalse(items.paused());
        vm.stopPrank();
    }

    function test_RevertsOnReinitialization() public {
        vm.expectRevert();
        central.initialize(owner);
    }

    function test_ProxyAdminOwnership() public {
        ProxyAdmin proxyAdmin = central.proxyAdmin();
        assertEq(proxyAdmin.owner(), owner);
    }
}