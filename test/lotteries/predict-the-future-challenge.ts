import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictTheFutureChallenge", function () {
  it("should return true if we predict the correct guess", async function () {
    const Challenge = await ethers.getContractFactory(
      "PredictTheFutureChallenge"
    );

    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const Proxy = await ethers.getContractFactory("PredictTheFutureProxy");
    const proxy = await Proxy.deploy();
    await proxy.deployed();

    const guessTx = await proxy.lockInGuess(challenge.address, {
      value: ethers.utils.parseEther("1"),
    });
    await guessTx.wait();

    // Mine a block so we don't trigger require(block.number > settlementBlockNumber)
    await ethers.provider.send("evm_mine", []);

    // Each call to settle causes a block to be mined. In a real test we'd want to set
    // up a block listener that tries repeatedly to settle.
    while (true) {
      const settleTx = await proxy.settle(challenge.address);
      await settleTx.wait();
      if ((await proxy.settled()) === true) {
        break;
      }
    }

    expect(await challenge.isComplete()).to.equal(true);

    await proxy.withdraw();
  });
});
