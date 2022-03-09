import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheRandomNumberChallenge", function () {
  it("should return true if we guess the random number", async function () {
    const Challenge = await ethers.getContractFactory(
      "GuessTheRandomNumberChallenge"
    );

    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const slotZero = await ethers.provider.getStorageAt(challenge.address, 0);
    const answer = ethers.BigNumber.from(slotZero).toNumber();

    await challenge.guess(answer, {
      value: ethers.utils.parseEther("1"),
    });

    expect(await challenge.isComplete()).to.equal(true);
  });
});
