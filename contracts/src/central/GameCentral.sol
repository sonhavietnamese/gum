// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract GameCentral {
    event GameCreated(address indexed creator, string title, address[] team);

    struct Game {
        string slug;
        string title;
        address creator;
        address[] team;
    }

    uint256 private nextGameId;
    mapping(uint256 => Game) private games;
    mapping(address => uint256[]) private creatorToGameIds;

    function createGame(string memory slug, string memory title, address[] memory team) external {
        uint256 gameId = nextGameId++;
        games[gameId] = Game({slug: slug, title: title, creator: msg.sender, team: team});

        creatorToGameIds[msg.sender].push(gameId);
        emit GameCreated(msg.sender, title, team);
    }

    function getGames() external view returns (Game[] memory) {
        Game[] memory allGames = new Game[](nextGameId);
        for (uint256 i = 0; i < nextGameId; i++) {
            allGames[i] = games[i];
        }
        return allGames;
    }

    function getGameBySlug(string memory slug) external view returns (Game memory) {
        for (uint256 i = 0; i < nextGameId; i++) {
            if (keccak256(abi.encodePacked(games[i].slug)) == keccak256(abi.encodePacked(slug))) {
                return games[i];
            }
        }
        revert("Game not found");
    }

    function getGame(uint256 gameId) external view returns (Game memory) {
        require(gameId < nextGameId, "Game does not exist");
        return games[gameId];
    }

    function getGameByCreator(address creator) external view returns (Game[] memory) {
        uint256[] storage gameIds = creatorToGameIds[creator];
        Game[] memory creatorGames = new Game[](gameIds.length);

        for (uint256 i = 0; i < gameIds.length; i++) {
            creatorGames[i] = games[gameIds[i]];
        }
        return creatorGames;
    }

    function addTeamMember(uint256 gameId, address newMember) external {
        require(gameId < nextGameId, "Game does not exist");
        Game storage game = games[gameId];
        require(msg.sender == game.creator, "Only the creator can add team members");

        game.team.push(newMember);
    }
}
