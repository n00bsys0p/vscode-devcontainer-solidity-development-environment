import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheNumberChallenge", function () {
  it("should return true if we guess the correct number", async function () {
    const Challenge = await ethers.getContractFactory(
      "GuessTheNumberChallenge"
    );
    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    await challenge.guess(42, {
      value: ethers.utils.parseEther("1"),
    });

    expect(await challenge.isComplete()).to.equal(true);
  });
});
