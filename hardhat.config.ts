import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {
<<<<<<< HEAD
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
=======
    xinfin: {
      url: process.env.XINFIN_NETWORK_URL,
      accounts: [process.env.PRIVATE_KEY!]
    },
    apothem: {
      url: process.env.APOTHEM_NETWORK_URL,
>>>>>>> origin/master
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};
<<<<<<< HEAD
//0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb
=======
>>>>>>> origin/master

export default config;

//