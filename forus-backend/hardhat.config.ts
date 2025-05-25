import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {

  solidity: "0.8.24",
  
  networks: {


    arbitrum: {
      url: process.env.ARBITRUM_MAIN_URL || "" ,
      accounts: [process.env.PRIVATE_KEY!]
    },
    
    polygonAmoy: {
      url: process.env.POLYGON_TESTNET_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }

   ,
    metis: {
      url: process.env.METIS_URL || "" ,
      accounts: [process.env.PRIVATE_KEY!]
    },

   

  }
};


export default config;
