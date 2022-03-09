import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheSecretNumberChallenge", function () {
  it("should return true if we guess the secret number", async function () {
    const Challenge = await ethers.getContractFactory(
      "GuessTheSecretNumberChallenge"
    );
    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const answerHash = await ethers.provider.getStorageAt(challenge.address, 0);
    for (let i = 0x00; i <= 0xff; i++) {
      const check = ethers.utils.keccak256(
        ethers.BigNumber.from(i).toHexString()
      );

      if (answerHash === check) {
        await challenge.guess(i, {
          value: ethers.utils.parseEther("1"),
        });
        break;
      }
    }

    expect(await challenge.isComplete()).to.equal(true);
  });
});
