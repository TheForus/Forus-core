import USDT from '../assets/usdt.png'
import pepe from "../assets/pepe.png"
import link from "../assets/link.png"
import dai from "../assets/dai.png"
import eth  from "../assets/eth.png"




interface Token {
    name: string;
    address: string;
    symbol: string;
}

export const Crypto: Token[] = [

    { name: "PEPE", address: "0x98b173f9f3a6c2c5d3494c5babf007ed1590e84e", symbol: pepe },
    { name: "LINK", address: "0x6b904451ababb342d2b787c5126c6361dd815246", symbol: link },
    { name: "USDT", address: "0x36160274b0ed3673e67f2ca5923560a7a0c523aa", symbol: USDT },
    { name: "DAI", address: "0x82fb927676b53b6ee07904780c7be9b4b50db80b", symbol: dai },
    { name: "ETH", address: "", symbol: eth },

];




