import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  
  networks: {
    
    hederatestnet: {
      url: process.env.HEDERA_TESTNET_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }

   ,
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_URL || "" ,
      accounts: [process.env.PRIVATE_KEY!]
    },


  }
};

export default config;
