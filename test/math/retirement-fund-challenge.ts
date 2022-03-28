import { expect } from "chai";
import { ethers } from "hardhat";

describe("RetirementFundChallenge", function () {
  it("should return true if we empty the retirement fund", async function () {
    const [, player] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory(
      "RetirementFundChallenge"
    );
    const challenge = await Challenge.deploy(player.address, {
      value: ethers.utils.parseEther("1"),
    });
    await challenge.deployed();

    const Solver = await ethers.getContractFactory("RetirementFundSolver");
    const solver = await Solver.deploy();
    await solver.deployed();

    await solver.die(challenge.address, {
      value: 1,
    });

    await challenge.connect(player).collectPenalty();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
