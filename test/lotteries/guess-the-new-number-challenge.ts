import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheNewNumberChallenge", function () {
  it("should return true if we guess the new number", async function () {
    const Challenge = await ethers.getContractFactory(
      "GuessTheNewNumberChallenge"
    );

    const challenge = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const Proxy = await ethers.getContractFactory("GuessTheNewNumberProxy");

    const proxy = await Proxy.deploy();
    await proxy.deployed();

    await proxy.guess(challenge.address, {
      value: ethers.utils.parseEther("1"),
    });

    expect(await challenge.isComplete()).to.equal(true);

    expect(await ethers.provider.getBalance(proxy.address)).to.equal(
      ethers.utils.parseEther("2")
    );

    const balanceBefore = await ethers.provider.getBalance(
      await proxy.signer.getAddress()
    );

    await proxy.withdraw();

    const balanceAfter = await ethers.provider.getBalance(
      await proxy.signer.getAddress()
    );

    // Check that we have ~2eth more in our wallet
    expect(
      ethers.utils
        .parseEther("2")
        .sub(balanceAfter.sub(balanceBefore))
        .lt(ethers.utils.parseEther("0.0001"))
    ).to.equal(true);

    expect(await ethers.provider.getBalance(proxy.address)).to.equal(0);
  });
});
