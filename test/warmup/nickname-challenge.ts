import { expect } from "chai";
import { ethers } from "hardhat";

describe("NicknameChallenge", function () {
  let backendAddress: string;

  before(async () => {
    const Backend = await ethers.getContractFactory("CaptureTheEther");
    const backend = await Backend.deploy();
    await backend.deployed();
    backendAddress = backend.address;
  });

  it("should return true after we set our nickname", async function () {
    const [player] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory("NicknameChallenge");
    const challenge = await Challenge.deploy(player.address);
    await challenge.deployed();

    const Backend = await ethers.getContractFactory("CaptureTheEther");
    const backend = Backend.attach(backendAddress);

    const setNicknameTx = await backend
      .connect(player)
      .setNickname(ethers.utils.formatBytes32String("Slim Shady"));
    await setNicknameTx.wait();

    expect(await challenge.isComplete(backend.address)).to.equal(true);
  });
});
