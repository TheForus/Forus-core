import apothem from "../assets/chains/apothem.png";
import goerli from "../assets/chains/goerli.png";
import sepolia from "../assets/chains/sepolia.jpeg";
import fantom from "../assets/chains/fantomTestnet.png";
import arb from "../assets/chains/ARB.png"

interface chain {
    name: string;
    chainId: string;
    symbol: string;
    currency: {
        symbol: string;
        decimals: number;

    }
    | any;
    rpcs: string[];
}


export const chainOptions: chain[] = [
    { name: "Sepolia ", chainId: "0xaa36a7", symbol: sepolia, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://rpc2.sepolia.org'] },
    { name: "Apothem", chainId: "0x33", symbol: apothem, currency: { symbol: "TXDC", decimals: 18 }, rpcs: ['https://apothem.xdcrpc.com'] },
    { name: "goerli", chainId: "0x5", symbol: goerli, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://ethereum-goerli.publicnode.com'] },
    { name: "fantom testnet", chainId: "0xfa2", symbol: fantom, currency: { symbol: "FTM", decimals: 18 }, rpcs: ['https://rpc.testnet.fantom.network'] },
    { name: "arbitrum sepolia", chainId: "0x66eee", symbol: goerli, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://sepolia-rollup.arbitrum.io/rpc'] },
];


// Network name
// Arbitrum Sepolia
// Network URL
// https://sepolia-rollup.arbitrum.io/rpc
// Chain ID
// 421614
// Currency symbol
// ETH