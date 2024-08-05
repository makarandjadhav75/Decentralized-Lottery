// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address public lastWinner;
    address payable[] public players;

    modifier restricted() {
      require(msg.sender == manager);
      _;  
    }

    constructor() {
        manager = msg.sender;
    }

    function random() private view returns (uint256) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function getRandomIndex() private view returns (uint256) {
        return random() % players.length;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

    function pickWinner() public restricted {
        uint256 index = getRandomIndex();
        players[index].transfer(address(this).balance);
        lastWinner = players[index];
        players = new address payable[](0);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}