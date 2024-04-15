import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  
  networks: {
    
    blasttestnet: {
      url: process.env.BLAST_TESTNET_URL || "",
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

// SafeMath deployed at: 0x37B7e3ab3452FAD6e8d76c784194f7038CF191F8
// Logs deployed at: 0xDC00EF1b8869412D57Ac87Cd7fA28209ACbd3EF3