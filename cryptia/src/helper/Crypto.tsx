import NOTE from '../assets/note.png'
import CANTO from '../assets/canto.png'
import ATOM from '../assets/atom.png'
import USDT from '../assets/usdt.png'
import ETH from '../assets/eth.png'
import USDC from '../assets/usdc.png'


interface Token {
    name: string;
    address: string;
    symbol: string;
}

export const Crypto: Token[] = [
    { name: "NOTE", address: "0x03F734Bd9847575fDbE9bEaDDf9C166F880B5E5f", symbol: NOTE },
    { name: "ATOM", address: "0x04a72466De69109889Db059Cb1A4460Ca0648d9D", symbol: ATOM },
    { name: "USDT", address: "0x40E41DC5845619E7Ba73957449b31DFbfB9678b2", symbol: USDT },
    { name: "ETH", address: "0xCa03230E7FB13456326a234443aAd111AC96410A", symbol: ETH },
    { name: "USDC", address: "0xc51534568489f47949A828C8e3BF68463bdF3566", symbol: USDC },
    { name: "CANTO", address: " ", symbol: CANTO }
];




