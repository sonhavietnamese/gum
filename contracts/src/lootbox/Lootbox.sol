// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Lootbox is Ownable, ReentrancyGuard {
    // Structs
    struct TokenInfo {
        address tokenAddress;
        uint256 tokenId;    // Used for ERC721 and ERC1155
        uint256 amount;     // Used for ERC20 and ERC1155
        uint256 tokenType;    // 20 for ERC20, 721 for ERC721, 1155 for ERC1155
    }

    struct LootboxInfo {
        string gameSlug;
        uint256 lootboxId;
        address creator;
        bool isActive;
        TokenInfo[] tokens;
    }

    // State variables
    mapping(uint256 => LootboxInfo) public lootboxes;
    uint256 private nextLootboxId;

    // Events
    event LootboxCreated(uint256 indexed lootboxId, string gameSlug, address creator);
    event LootboxOpened(uint256 indexed lootboxId, address opener);
    event TokensAdded(uint256 indexed lootboxId, address tokenAddress, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // Create a new lootbox
    function createLootbox(string memory gameSlug) external returns (uint256) {
        uint256 lootboxId = nextLootboxId++;
        
        LootboxInfo storage newLootbox = lootboxes[lootboxId];
        newLootbox.gameSlug = gameSlug;
        newLootbox.lootboxId = lootboxId;
        newLootbox.creator = msg.sender;
        newLootbox.isActive = true;
        // tokens array will be initialized empty by default

        emit LootboxCreated(lootboxId, gameSlug, msg.sender);
        return lootboxId;
    }

    // Add tokens to a lootbox
    function addTokensToLootbox(
        uint256 lootboxId,
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 tokenType
    ) external {
        require(lootboxes[lootboxId].isActive, "Lootbox is not active");
        require(lootboxes[lootboxId].creator == msg.sender, "Not the lootbox creator");

        // Transfer tokens to this contract
        if (tokenType == 20) {
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        } else if (tokenType == 721) {
            IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);
        } else if (tokenType == 1155) {
            IERC1155(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        } else {
            revert("Invalid token type");
        }

        // Add token info to the lootbox
        lootboxes[lootboxId].tokens.push(TokenInfo({
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            amount: amount,
            tokenType: tokenType
        }));

        emit TokensAdded(lootboxId, tokenAddress, amount);
    }

    // Open a lootbox and receive all tokens
    function openLootbox(uint256 lootboxId) external nonReentrant {
        LootboxInfo storage lootbox = lootboxes[lootboxId];
        require(lootbox.isActive, "Lootbox is not active");

        // Transfer all tokens to the opener
        for (uint256 i = 0; i < lootbox.tokens.length; i++) {
            TokenInfo memory token = lootbox.tokens[i];

            if (token.tokenType == 20) {
                IERC20(token.tokenAddress).transfer(msg.sender, token.amount);
            } else if (token.tokenType == 721) {
                IERC721(token.tokenAddress).transferFrom(address(this), msg.sender, token.tokenId);
            } else if (token.tokenType == 1155) {
                IERC1155(token.tokenAddress).safeTransferFrom(
                    address(this),
                    msg.sender,
                    token.tokenId,
                    token.amount,
                    ""
                );
            }
        }

        // Deactivate the lootbox
        lootbox.isActive = false;

        emit LootboxOpened(lootboxId, msg.sender);
    }

    // View functions
    function getLootboxInfo(uint256 lootboxId) external view returns (
        string memory gameSlug,
        address creator,
        bool isActive,
        uint256 tokenCount
    ) {
        LootboxInfo storage lootbox = lootboxes[lootboxId];
        return (
            lootbox.gameSlug,
            lootbox.creator,
            lootbox.isActive,
            lootbox.tokens.length
        );
    }

    function getLootboxTokens(uint256 lootboxId) external view returns (TokenInfo[] memory) {
        return lootboxes[lootboxId].tokens;
    }
}