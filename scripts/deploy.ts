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

  //SafeMath deployed at: 0x7eb471567d4f93D6286C8026a65Fd5016D1aA23A
// Logs deployed at: 0x7ae827b45BDaCaF809F1f4fd633D15045eb8271b