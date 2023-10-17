import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {
    PEGOTestnet : {

      url: process.env.PEGO_API_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }

    // EosEvmTestnet: {
    //   url: process.env.EOS_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // },
    // ArbitrumSepolia: {
    //   url: process.env.ARBITRUM_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // },
    // sepolia: {
    //   url: process.env.ALCHEMY_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // },
    // goerli: {
    //   url: process.env.ALCHEMY_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // }
    // ,
    // apothem: {
    //   url: process.env.APOTHEM_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // },
    // fantomtestnet: {
    //   url: process.env.FANTOM_API_URL,
    //   accounts: [process.env.PRIVATE_KEY!]
    // }

  }
};

//0x021CC9B8A9Cb9d677cC403cB81F44a689739E2Aa sepolia
//0x3957018eC2835E8B969245291850575064eCe716 apothem
//0x2c5033531DC96b4F555D7a644c7E418661ccec64 fantom testnet
// 0x6C18c89ABCF1b2d01D8cA5C0e130258634f01586 pego

export default config;


