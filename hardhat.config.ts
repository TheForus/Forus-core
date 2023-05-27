import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {
    xinfin: {
      url: process.env.XINFIN_NETWORK_URL,
      accounts: [process.env.PRIVATE_KEY!]
    },
    apothem: {
      url: process.env.APOTHEM_NETWORK_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;

//0x0A3E438D24b28de5359a2C77f9bf3C530E1953A4