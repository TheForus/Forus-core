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

    { name: "PEPE", address: "0x33f4212b027e22af7e6ba21fc572843c0d701cd1", symbol: pepe },
    { name: "LINK", address: "0xa151660a77f223e87298de16ee5bb7447982b62f", symbol: link },
    { name: "USDT", address: "0xd4b5f10d61916bd6e0860144a91ac658de8a1437", symbol: USDT },
    { name: "DAI", address: "0x1e2913e1ac339a4996353f8f58be0de3d109b5a5", symbol: dai },
    { name: "ETH", address: "", symbol: eth },

];




