import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {

    // sepolia: {
    //   url: process.env.ALCHEMY_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // },
    // goerli: {
    //   url: process.env.ALCHEMY_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // }
    // ,
    apothem: {
      url: process.env.APOTHEM_API_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

//0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb sepolia
//0x5c75A721154B03C8cAA8Beaab9803b1c214D2a3b apothem

export default config;


