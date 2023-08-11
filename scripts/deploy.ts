import { ethers } from "hardhat";

async function main() {

  const Logs = await ethers.getContractFactory("Logs");
  const log = await Logs.deploy();
  await log.deployed();

  console.log(`Contract address ${log.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
