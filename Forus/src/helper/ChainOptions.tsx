import apothem from "../assets/chains/apothem.png";
import goerli from "../assets/chains/goerli.png";
import sepolia from "../assets/chains/sepolia.jpeg";
import fantom from "../assets/chains/fantomTestnet.png";

interface chain {
    name: string;
    chainId: string;
    symbol: string;
}


export const chainOptions: chain[] = [
    { name: "Sepolia", chainId: "0xaa36a7", symbol: sepolia },
    { name: "Apothem", chainId: "0x33", symbol: apothem },
    { name: "goerli", chainId: "0x5", symbol: goerli },
    { name: "fantom testnet", chainId: "0xfa2", symbol: fantom },
  ];
