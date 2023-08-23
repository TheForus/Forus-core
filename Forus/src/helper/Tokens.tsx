import USDT from '../assets/usdt.png'
import pepe from "../assets/pepe.png"
import link from "../assets/link.png"
import dai from "../assets/dai.png"
import eth  from "../assets/eth.png"
import xdc from "../assets/chains/apothem.png"




interface Token {
    name: string;
    address: string;
    symbol: string;
}



export const EthTokens: Token[] = [

    { name: "PEPE", address: "0x98b173f9f3a6c2c5d3494c5babf007ed1590e84e", symbol: pepe },
    { name: "LINK", address: "0x6b904451ababb342d2b787c5126c6361dd815246", symbol: link },
    { name: "USDT", address: "0x36160274b0ed3673e67f2ca5923560a7a0c523aa", symbol: USDT },
    { name: "DAI", address: "0x82fb927676b53b6ee07904780c7be9b4b50db80b", symbol: dai },
    { name: "ETH", address: "", symbol: eth },

];

export const XdcTokens: Token[] = [

    { name: "LINK", address: "0x499f9320079c3a5dd30af691ea1a88e8c75fda17", symbol: link },
    { name: "USDT", address: "0xccdc0653935a251b6839f30359917977f994b5d9", symbol: USDT },
    { name: "DAI", address: "0xe46554ad93a7046c85f2da0c20ebd68e41f11b36", symbol: dai },
    { name: "XDC", address: "", symbol: xdc },

];




