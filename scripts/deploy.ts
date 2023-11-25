import { ethers } from "hardhat";

async function main() {
  // Deploy SafeMath first
  const SafeMath = await ethers.getContractFactory("SafeMath");
  const safeMath = await SafeMath.deploy();
  await safeMath.deployed();



  // Deploy the main contract with library addresses
  const Logs = await ethers.getContractFactory("Logs");

  const log = await Logs.deploy();
  await log.deployed();

  console.log(`SafeMath deployed at: ${safeMath.address}`);
  console.log(`Logs deployed at: ${log.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

