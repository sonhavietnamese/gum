// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console2} from "forge-std/Test.sol";
import {Lootbox} from "../src/lootbox/Lootbox.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockERC721} from "./mocks/MockERC721.sol";
import {MockERC1155} from "./mocks/MockERC1155.sol";

contract LootboxTest is Test {
    Lootbox public lootbox;
    MockERC20 public mockERC20;
    MockERC721 public mockERC721;
    MockERC1155 public mockERC1155;

    address public creator = makeAddr("creator");
    address public user = makeAddr("user");
    
    uint256 constant INITIAL_BALANCE = 1000 ether;
    string constant GAME_SLUG = "test-game";

    event LootboxCreated(uint256 indexed lootboxId, string gameSlug, address creator);
    event LootboxOpened(uint256 indexed lootboxId, address opener);
    event TokensAdded(uint256 indexed lootboxId, address tokenAddress, uint256 amount);

    function setUp() public {
        // Deploy contracts
        lootbox = new Lootbox();
        mockERC20 = new MockERC20("Test Token", "TEST");
        mockERC721 = new MockERC721("Test NFT", "TEST");
        mockERC1155 = new MockERC1155("Test ERC1155");

        // Setup initial balances
        vm.startPrank(creator);
        mockERC20.mint(creator, INITIAL_BALANCE);
        mockERC721.mint(creator, 1);
        mockERC1155.mint(creator, 1, 100, "");
        vm.stopPrank();
    }

    function test_CreateLootbox() public {
        vm.startPrank(creator);
        
        vm.expectEmit(true, true, true, true);
        emit LootboxCreated(0, GAME_SLUG, creator);
        
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        assertEq(lootboxId, 0, "First lootbox should have ID 0");

        (string memory gameSlug, address lootboxCreator, bool isActive, uint256 tokenCount) = 
            lootbox.getLootboxInfo(lootboxId);

        assertEq(gameSlug, GAME_SLUG, "Game slug should match");
        assertEq(lootboxCreator, creator, "Creator should match");
        assertTrue(isActive, "Lootbox should be active");
        assertEq(tokenCount, 0, "Should start with no tokens");
        
        vm.stopPrank();
    }

    function test_AddERC20ToLootbox() public {
        vm.startPrank(creator);
        
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        uint256 amount = 100 ether;

        mockERC20.approve(address(lootbox), amount);

        vm.expectEmit(true, true, true, true);
        emit TokensAdded(lootboxId, address(mockERC20), amount);

        lootbox.addTokensToLootbox(
            lootboxId,
            address(mockERC20),
            0, // tokenId not used for ERC20
            amount,
            20
        );

        Lootbox.TokenInfo[] memory tokens = lootbox.getLootboxTokens(lootboxId);
        assertEq(tokens.length, 1, "Should have one token");
        assertEq(tokens[0].tokenAddress, address(mockERC20), "Token address should match");
        assertEq(tokens[0].amount, amount, "Amount should match");
        assertEq(tokens[0].tokenType, 20, "Token type should be ERC20");

        vm.stopPrank();
    }

    function test_AddERC721ToLootbox() public {
        vm.startPrank(creator);
        
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        uint256 tokenId = 1;

        mockERC721.approve(address(lootbox), tokenId);

        lootbox.addTokensToLootbox(
            lootboxId,
            address(mockERC721),
            tokenId,
            1, // amount must be 1 for ERC721
            721
        );

        Lootbox.TokenInfo[] memory tokens = lootbox.getLootboxTokens(lootboxId);
        assertEq(tokens.length, 1, "Should have one token");
        assertEq(tokens[0].tokenAddress, address(mockERC721), "Token address should match");
        assertEq(tokens[0].tokenId, tokenId, "Token ID should match");
        assertEq(tokens[0].tokenType, 721, "Token type should be ERC721");

        vm.stopPrank();
    }

    function test_OpenLootbox() public {
        // Setup lootbox with tokens
        vm.startPrank(creator);
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        
        // Add ERC20
        uint256 erc20Amount = 100 ether;
        mockERC20.approve(address(lootbox), erc20Amount);
        lootbox.addTokensToLootbox(lootboxId, address(mockERC20), 0, erc20Amount, 20);
        
        // Add ERC721
        uint256 tokenId = 1;
        mockERC721.approve(address(lootbox), tokenId);
        lootbox.addTokensToLootbox(lootboxId, address(mockERC721), tokenId, 1, 721);
        vm.stopPrank();

        // Open lootbox as user
        vm.startPrank(user);
        
        vm.expectEmit(true, true, true, true);
        emit LootboxOpened(lootboxId, user);
        
        lootbox.openLootbox(lootboxId);

        // Verify tokens were transferred
        assertEq(mockERC20.balanceOf(user), erc20Amount, "User should receive ERC20 tokens");
        assertEq(mockERC721.ownerOf(tokenId), user, "User should receive ERC721 token");

        // Verify lootbox is inactive
        (, , bool isActive, ) = lootbox.getLootboxInfo(lootboxId);
        assertFalse(isActive, "Lootbox should be inactive after opening");

        vm.stopPrank();
    }

    function testFail_AddToInactiveLootbox() public {
        vm.startPrank(creator);
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        
        // Open the lootbox
        lootbox.openLootbox(lootboxId);
        
        // Try to add tokens to inactive lootbox
        mockERC20.approve(address(lootbox), 100);
        lootbox.addTokensToLootbox(lootboxId, address(mockERC20), 0, 100, 20);
        vm.stopPrank();
    }

    function testFail_NonCreatorAddTokens() public {
        vm.prank(creator);
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        
        // Try to add tokens as non-creator
        vm.prank(user);
        lootbox.addTokensToLootbox(lootboxId, address(mockERC20), 0, 100, 20);
    }

    function testFail_OpenInactiveLootbox() public {
        vm.startPrank(creator);
        uint256 lootboxId = lootbox.createLootbox(GAME_SLUG);
        lootbox.openLootbox(lootboxId);
        vm.stopPrank();

        // Try to open already opened lootbox
        vm.prank(user);
        lootbox.openLootbox(lootboxId);
    }
}
