// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/central/GameCentral.sol";

contract GameCentralTest is Test {
    GameCentral private gameCentral;

    function setUp() public {
        gameCentral = new GameCentral();
    }

    function testCreateGame() public {
        address[] memory team = new address[](2);
        team[0] = address(0x123);
        team[1] = address(0x456);

        gameCentral.createGame("Test Game", team);

        GameCentral.Game[] memory games = gameCentral.getGames();
        assertEq(games.length, 1);
        assertEq(games[0].title, "Test Game");
        assertEq(games[0].creator, address(this));
        assertEq(games[0].team.length, 2);
        assertEq(games[0].team[0], address(0x123));
        assertEq(games[0].team[1], address(0x456));
    }

    function testAddTeamMember() public {
        address[] memory team = new address[](1);
        team[0] = address(0x123);

        gameCentral.createGame("Test Game", team);

        gameCentral.addTeamMember(0, address(0x789));

        GameCentral.Game[] memory games = gameCentral.getGames();
        assertEq(games[0].team.length, 2);
        assertEq(games[0].team[1], address(0x789));
    }

    function testAddTeamMemberNotCreator() public {
        address[] memory team = new address[](1);
        team[0] = address(0x123);

        gameCentral.createGame("Test Game", team);

        vm.prank(address(0x456));
        vm.expectRevert("Only the creator can add team members");
        gameCentral.addTeamMember(0, address(0x789));
    }

    function testAddTeamMemberGameDoesNotExist() public {
        vm.expectRevert("Game does not exist");
        gameCentral.addTeamMember(0, address(0x789));
    }
}
