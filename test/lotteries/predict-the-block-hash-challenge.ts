import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictTheBlockHashChallenge", function () {
  it("should return true if we predict the future block hash", async function () {
    const Challenge = await ethers.getContractFactory(
      "PredictTheBlockHashChallenge"
    );

    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const guessTx = await challenge.lockInGuess(
      ethers.utils.hexZeroPad("0x00", 32),
      {
        value: ethers.utils.parseEther("1"),
      }
    );
    await guessTx.wait();

    // Mine 257 blocks to make sure we're over the limit for accessible block
    // hashes.
    for (let i = 0; i <= 256; i++) {
      await ethers.provider.send("evm_mine", []);
    }

    const settleTx = await challenge.settle();
    await settleTx.wait();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
