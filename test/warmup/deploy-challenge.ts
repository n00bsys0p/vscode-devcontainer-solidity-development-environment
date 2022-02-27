import { expect } from "chai";
import { ethers } from "hardhat";

describe("DeployChallenge", function () {
  it("should return true when deployed", async function () {
    const Challenge = await ethers.getContractFactory("DeployChallenge");
    const challenge = await Challenge.deploy();
    await challenge.deployed();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
