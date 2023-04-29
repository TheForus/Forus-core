import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: ".env" });


const PRIVATEKEY : string | any  = process.env.privateKey

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    cantoTestnet: {
      url: "https://canto-testnet.plexnode.wtf",
      accounts : [PRIVATEKEY]
      // Additional RPC configuration parameters can be added here if needed
    },
  },
};

export default config;

// Contract address 0x6340e1ed7DCe39ccA016C1805286Aa11536b4F3a