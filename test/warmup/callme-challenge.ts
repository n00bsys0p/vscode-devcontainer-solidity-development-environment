import { expect } from "chai";
import { ethers } from "hardhat";

describe("CallMeChallenge", function () {
  it("should return true after we call the method", async function () {
    const Challenge = await ethers.getContractFactory("CallMeChallenge");
    const challenge = await Challenge.deploy();
    await challenge.deployed();

    await challenge.callme();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
