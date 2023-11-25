
// import sepolia from "../assets/chains/sepolia.jpeg";

import USDT from '../assets/usdt.png'
import link from "../assets/link.png"
import dai from "../assets/dai.png"
import eth from "../assets/eth.png"
import arb from "../assets/chains/ARB.png"
// import avax from "../assets/avax.png"
import matic from "../assets/chains/matic.png"
import klay from "../assets/klay.png"




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
        name: "Klaytn Testnet Baobab", contract: '0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb', chainId: "0x3e9", symbol: klay, currency: { symbol: "KLAY", decimals: 18 }, rpcs: ['https://public-en-baobab.klaytn.net'], url: "https://klaytnscope.com/tx/", tokens: [


            { name: "KLAY", address: "", symbol: klay },
            { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


        ]
    },




    {
        name: "Arbitrum Sepolia Testnet", contract: '0x6C18c89ABCF1b2d01D8cA5C0e130258634f01586', chainId: "0x66eee", symbol: arb, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia-rollup.arbitrum.io/rpc'], url: "https://sepolia-explorer.arbitrum.io/tx/", tokens: [


            { name: "ETH", address: "", symbol: arb },
            { name: "ARB", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: arb },
            { name: "LINK", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
            { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


        ]
    },
    // {
    //     name: "Avalanche Fuji", contract: '', chainId: "0xa869", symbol: avax, currency: { symbol: "AVAX", decimals: 18 }, rpcs: ['https://api.avax-test.network/ext/bc/C/rpc'], url: "https://testnet.avax.network", tokens: [

    //         { name: "AVAX", address: "", symbol: avax },
    //         { name: "USDT", address: "0x36160274b0ed3673e67f2ca5923560a7a0c523aa", symbol: USDT },
    //         { name: "DAI", address: "0x82fb927676b53b6ee07904780c7be9b4b50db80b", symbol: dai },


    //     ]
    // },
 
    // {
    //     name: "PEGO Mainnet", contract: '0x6C18c89ABCF1b2d01D8cA5C0e130258634f01586', chainId: "0x1343e3e", symbol: pego, currency: { symbol: "PG", decimals: 18 }, rpcs: ['https://pegorpc.com'], url: "https://scan.pego.network/tx/", tokens: [

    //         { name: "PG", address: "", symbol: pego },
    //         { name: "USDC", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
    //         { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
    //         { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


    //     ]
    // },

    // {
    //     name: "Fantom Testnet", contract: '0x48b96fF6D5027f6b8bDc9D2FcC13559bf63829Fc', chainId: "0xfa2", symbol: fantom, currency: { symbol: "FTM", decimals: 18 }, rpcs: ['https://rpc.testnet.fantom.network'], url: "https://explorer.testnet.fantom.network/transactions/", tokens: [


    //         { name: "FTM", address: "", symbol: ftm },
    //         { name: "USDC", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
    //         { name: "USDT", address: "0x40afC1AD5Ba35164b578C8c971B366ECE07C200A", symbol: USDT },
    //         { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


    //     ]
    // },
   
    // {
    //     name: "Eos Testnet", contract: '0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb', chainId: "0x3cc5", symbol: goerli, currency: { symbol: "EOS", decimals: 18 }, rpcs: ['https://api.testnet.evm.eosnetwork.com'], url: "https://explorer.testnet.evm.eosnetwork.com/tx/", tokens: [

    //         { name: "EOS", address: "", symbol: eth },
    //         { name: "LINK", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
    //         { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
    //         { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


    //     ]
    // },

    // {
    //     name: "Arbitrum Goerli", contract: '0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb', chainId: "0x66eed", symbol: arb, currency: { symbol: "AGOR", decimals: 18 }, rpcs: ['https://endpoints.omniatech.io/v1/arbitrum/goerli/public'], url: "https://sepolia-explorer.arbitrum.io/tx/", tokens: [


    //         { name: "AGOR", address: "", symbol: arb },
    //         { name: "ARB", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: arb },
    //         { name: "LINK", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
    //         { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
    //         { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


    //     ]
    // },
    {
        name: "Sepolia", contract: '0x356167A5785B39B4e9d41d981cBe1CC79A139766', chainId: "0xaa36a7", symbol: eth, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://eth-sepolia.g.alchemy.com/v2/demo'], url: "https://sepolia.etherscan.io/tx/", tokens: [


            { name: "ETH", address: "", symbol: eth },
            { name: "USDC", address: "0xfafedb041c0dd4fa2dc0d87a6b0979ee6fa7af5f", symbol: link },
            { name: "USDT", address: "0x40afC1AD5Ba35164b578C8c971B366ECE07C200A", symbol: USDT },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


        ]
    },

    {
        name: "Mumbai", contract: '0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb', chainId: "0x13881", symbol: matic, currency: { symbol: "MATIC", decimals: 18 }, rpcs: ['https://rpc-mumbai.maticvigil.com'], url: "https://mumbai.polygonscan.com/tx/", tokens: [


            { name: "MATIC", address: "", symbol: matic },
            { name: "USDT", address: "0x211554151f2f00305f33530fdd3a5d0354927a65", symbol: USDT },
            { name: "DAI", address: "0x9440c3bb6adb5f0d5b8a460d8a8c010690dac2e8", symbol: dai },


        ]
    },

];


//0x356167A5785B39B4e9d41d981cBe1CC79A139766  Sepolia