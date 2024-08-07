

import USDT from '../assets/usdt.png'
import dai from "../assets/dai.png"
import eth from "../assets/eth.png"
import arb from "../assets/chains/ARB.png"
import blast from "../assets/blast.png"
import frxeth from "../assets/frxeth.png"




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
        name: "Arbitrum Sepolia Testnet", contract: '0xDC00EF1b8869412D57Ac87Cd7fA28209ACbd3EF3', chainId: "0x66eee", symbol: arb, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia-rollup.arbitrum.io/rpc'], url: "https://sepolia-explorer.arbitrum.io/tx/", tokens: [


            { name: "ETH", address: "", symbol: arb },
            { name: "ARB", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: arb },
            { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
   


        ]
    },



    {
        name: "Fraxtal", contract: '0x9152D9eF04Bf00BE1A408C2b2FE78a87cD9CdcC7', chainId: "0xfc", symbol: frxeth, currency: { symbol: "frxETH", decimals: 18 }, rpcs: ['https://rpc.frax.com'], url: "https://fraxscan.com/tx/", tokens: [

            { name: "frxETH", address: "", symbol: frxeth },
        
        ]
    },


    {
        name: "Fraxtal Testnet", contract: '0xee346C29CF59A505a33d22dCaE281C05F53c3Ed5', chainId: "0x9da", symbol: frxeth, currency: { symbol: "frxETH", decimals: 18 }, rpcs: ["https://rpc.testnet.frax.com"], url: "https://holesky.fraxscan.com/tx/", tokens: [

            { name: "frxETH", address: "", symbol: frxeth },
        
        ]
    },

    {
        name: "Blast Sepolia Testnet", contract: '0x074bB0B14C2e310c1ad5b94c390E7FC4Ac06b67d', chainId: "0xa0c71fd", symbol: blast, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia.blast.io'], url: "https://testnet.blastscan.io/tx/", tokens: [

            { name: "ETH", address: "", symbol: eth },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },

        ]
    }
];


