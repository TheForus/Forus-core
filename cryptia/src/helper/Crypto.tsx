import USDT from '../assets/usdt.png'
import PLI from "../assets/pli.png"
import stXDC from "../assets/stxdc.jpeg"
import USXD from "../assets/usxd.jpeg"
import SRX  from "../assets/SRX.png"
import XDC  from "../assets/WXDC.png"



interface Token {
    name: string;
    address: string;
    symbol: string;
}

export const Crypto: Token[] = [
    { name: "PLI", address: "0x33f4212b027e22af7e6ba21fc572843c0d701cd1", symbol: PLI },
    { name: "SRX", address: "0x5D5f074837f5d4618B3916ba74De1Bf9662a3fEd", symbol: SRX },
    { name: "stXDC", address: "0xa151660a77f223e87298de16ee5bb7447982b62f", symbol: stXDC },
    { name: "USDT", address: "0xd4b5f10d61916bd6e0860144a91ac658de8a1437", symbol: USDT },
    { name: "USXD", address: "0x1e2913e1ac339a4996353f8f58be0de3d109b5a5", symbol: USXD },
    { name: "XDC", address: "", symbol: XDC },

];




