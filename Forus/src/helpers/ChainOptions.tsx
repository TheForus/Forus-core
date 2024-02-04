
// import sepolia from "../assets/chains/sepolia.jpeg";

import USDT from '../assets/usdt.png'
import link from "../assets/link.png"
import dai from "../assets/dai.png"
import eth from "../assets/eth.png"
import arb from "../assets/chains/ARB.png"
import blast from "../assets/blast.png"




interface Token {
    name: string;
    address: string;
    symbol: string;
}


interface chain {
    name: string;
    contract: string;
    chainId: string;
    symbol: string;
    currency: {
        symbol: string;
        decimals: number;

    }
    | any;
    rpcs: string[];
    url: string
    tokens: Token[]
}




export const chainOptions: chain[] = [
    {
        name: "Arbitrum Sepolia Testnet", contract: '0x6C18c89ABCF1b2d01D8cA5C0e130258634f01586', chainId: "0x66eee", symbol: arb, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia-rollup.arbitrum.io/rpc'], url: "https://sepolia-explorer.arbitrum.io/tx/", tokens: [


            { name: "ETH", address: "", symbol: arb },
            { name: "ARB", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: arb },
            { name: "LINK", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
            { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


        ]
    },

    {
        name: "Blast Sepolia Testnet", contract: '0x074bB0B14C2e310c1ad5b94c390E7FC4Ac06b67d', chainId: "0xa0c71fd", symbol: blast, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia.blast.io'], url: "https://testnet.blastscan.io/tx/", tokens: [

            { name: "ETH", address: "", symbol: eth },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },

        ]
    }
];


// Network name
// Blast Sepolia Testnet
// Network URL
// https://sepolia.blast.io
// Chain ID
// 168587773
// Currency symbol
// ETH
// Block explorer URL
// https://testnet.blastscan.io

//0x356167A5785B39B4e9d41d981cBe1CC79A139766  Sepolia