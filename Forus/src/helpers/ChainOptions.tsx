

import USDT from '../assets/usdt.png'
import arb from "../assets/chains/ARB.png"
import eth from   "../assets/eth.png"
import metis from "../assets/metis.png"
import matic from "../assets/matic.png"





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
        name: "Metis Andromeda Mainnet", contract: '0x2f5Fa595c66d3bB73f18B5932246430772300641', chainId: "0x440", symbol: metis, currency: { symbol: "METIS", decimals: 18 }, rpcs: ['https://andromeda.metis.io/?owner=1088'], url: "https://andromeda-explorer.metis.io/tx/", tokens: [


            { name: "metis", address: "", symbol: metis },
            { name: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: USDT },



        ]
    },

    {
        name: "Amoy", contract: '0x9152D9eF04Bf00BE1A408C2b2FE78a87cD9CdcC7', chainId: "0x13882", symbol: matic, currency: { symbol: "POL", decimals: 18 }, rpcs: ['wss://polygon-amoy-bor-rpc.publicnode.com'], url: "https://www.oklink.com/amoy‍", tokens: [


            { name: "MATIC", address: "", symbol: matic },
   
        ]
    },






]
