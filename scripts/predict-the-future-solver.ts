import { ethers } from "hardhat";

const CHALLENGE_ADDRESS = process.env.CHALLENGE_ADDRESS;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying solver to with %s", deployer.address);
  const Proxy = await ethers.getContractFactory("PredictTheFutureProxy");
  const proxy = await Proxy.deploy();
  await proxy.deployed();

  console.log("Locking in guess");
  const guessTx = await proxy.lockInGuess(CHALLENGE_ADDRESS!);
  await guessTx.wait();

  let settled = false;
  let settling = false;
  proxy.provider.on("block", async (height) => {
    if (settling) {
      return;
    }

    settling = true;
    try {
      console.log("New block! Attempting to settle at %s", height);
      const settleTx = await proxy.settle(CHALLENGE_ADDRESS!);
      await settleTx.wait();
      settled = await proxy.settled();
    } finally {
      settling = false;
    }
  });

  console.log("Waiting to settle");
  await new Promise((resolve) => {
    function checkSettled() {
      if (settled) {
        resolve(undefined);
      } else {
        setTimeout(checkSettled, 10000);
      }
    }

    checkSettled();
  });

  if (
    (await ethers.provider.getBalance(proxy.address)) ===
    ethers.utils.parseEther("2")
  ) {
    console.log("Complete! Withdrawing...");
    await proxy.withdraw();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
