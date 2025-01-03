// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {CurrencyCentral} from "../src/central/CurrencyCentral.sol";
import {Currency} from "../src/currency/Currency.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract CurrencyCentralTest is Test {
    CurrencyCentral public central;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public admin = makeAddr("admin");

    event CurrencyCreated(address indexed currencyAddress, string name, string symbol, address owner);

    function setUp() public {
        address proxy =
            Upgrades.deployTransparentProxy("CurrencyCentral.sol", msg.sender, abi.encodeCall(CurrencyCentral.initialize, (admin)));

        central = CurrencyCentral(proxy);
    }

    function test_Constructor() public {
        // Check that initialize() can't be called again
        vm.expectRevert(abi.encodeWithSignature("InvalidInitialization()"));
        central.initialize(alice);

        // Verify the implementation and proxy admin are set correctly
        assertTrue(central.implementation() != address(0), "Implementation should be set");
        assertTrue(address(central.proxyAdmin()) != address(0), "ProxyAdmin should be set");
    }

    function test_CreateCurrency() public {
        string memory name = "Test Token";
        string memory symbol = "TEST";

        vm.startPrank(alice);

        address tokenAddress = central.createCurrency(
            name,
            symbol,
            alice, // defaultAdmin
            alice, // pauser
            alice // minter
        );

        Currency token = Currency(tokenAddress);

        emit log_address(tokenAddress);

        assertEq(token.name(), name, "Token name should match");
        assertEq(token.symbol(), symbol, "Token symbol should match");
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), alice), "Alice should have admin role");
        assertTrue(token.hasRole(token.PAUSER_ROLE(), alice), "Alice should have pauser role");
        assertTrue(token.hasRole(token.MINTER_ROLE(), alice), "Alice should have minter role");

        vm.stopPrank();
    }

    function test_GetUserCurrencies() public {
        vm.startPrank(alice);

        // Create multiple currencies
        address token1 = central.createCurrency("Token1", "TK1", alice, alice, alice);
        address token2 = central.createCurrency("Token2", "TK2", alice, alice, alice);

        emit log_address(token1);
        emit log_address(token2);

        address[] memory aliceTokens = central.getUserCurrencies(alice);
        assertEq(aliceTokens.length, 2, "Alice should have 2 tokens");
        assertEq(aliceTokens[0], token1, "First token should match");
        assertEq(aliceTokens[1], token2, "Second token should match");

        vm.stopPrank();

        // Check Bob's tokens (should be empty)
        address[] memory bobTokens = central.getUserCurrencies(bob);
        assertEq(bobTokens.length, 0, "Bob should have no tokens");
    }

    function test_CreateMultipleTokensWithDifferentOwners() public {
        // Alice creates a token
        vm.prank(alice);
        address aliceToken = central.createCurrency("AliceToken", "AT", alice, alice, alice);

        // Bob creates a token
        vm.prank(bob);
        address bobToken = central.createCurrency("BobToken", "BT", bob, bob, bob);

        // Check Alice's tokens
        address[] memory aliceTokens = central.getUserCurrencies(alice);
        assertEq(aliceTokens.length, 1, "Alice should have 1 token");
        assertEq(aliceTokens[0], aliceToken, "Alice's token should match");

        // Check Bob's tokens
        address[] memory bobTokens = central.getUserCurrencies(bob);
        assertEq(bobTokens.length, 1, "Bob should have 1 token");
        assertEq(bobTokens[0], bobToken, "Bob's token should match");
    }

    function test_UserCanMintToken() public {
        vm.startPrank(alice);

        // Create a currency
        address tokenAddress = central.createCurrency("MintableToken", "MTK", alice, alice, alice);
        Currency token = Currency(tokenAddress);

        // Mint tokens
        uint256 mintAmount = 1000 * 10 ** token.decimals();
        token.mint(alice, mintAmount);

        // Check balance
        uint256 balance = token.balanceOf(alice);
        assertEq(balance, mintAmount, "Alice's balance should match the minted amount");

        vm.stopPrank();
    }
}
