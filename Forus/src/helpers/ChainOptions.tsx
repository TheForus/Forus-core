

import USDT from '../assets/usdt.png'
import arb from "../assets/chains/ARB.png"
import eth from "../assets/eth.png"
import metis from "../assets/metis.png"
import base from "../assets/base.png"






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
        name: "Arbitrum One", contract: '0xfc739432ba84371598d58f24982426ea66962dba', chainId: "0xa4b1", symbol: arb, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://arb1.arbitrum.io/rpc'], url: "https://arbiscan.io/tx/", tokens: [


            { name: "ETH", address: "", symbol: eth },
            { name: "ARB", address: "0x912CE59144191C1204E64559FE8253a0e49E6548", symbol: arb },
            { name: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: USDT },



        ]
    },

    {
        name: "Horizen Base sepolia ", contract: '0x107fdE93838e3404934877935993782F977324BB', chainId: "0x14a34", symbol: arb, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia.base.org'], url: "https://sepolia.basescan.org/", tokens: [


            { name: "ETH", address: "", symbol: eth },
            { name: "Zen", address: "0x107fdE93838e3404934877935993782F977324BB", symbol: "" },
            { name: "Base", address: "0x107fdE93838e3404934877935993782F977324BB", symbol: base },




        ]
    },


    {
        name: "Metis Andromeda Mainnet", contract: '0x2f5Fa595c66d3bB73f18B5932246430772300641', chainId: "0x440", symbol: metis, currency: { symbol: "METIS", decimals: 18 }, rpcs: ['https://andromeda.metis.io/?owner=1088'], url: "https://andromeda-explorer.metis.io/tx/", tokens: [


            { name: "metis", address: "", symbol: metis },
            { name: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: USDT },



        ]
    },








]
