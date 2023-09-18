import apothem from "../assets/chains/apothem.png";
import goerli from "../assets/chains/goerli.png";
import sepolia from "../assets/chains/sepolia.jpeg";
import fantom from "../assets/chains/fantomTestnet.png";

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
    { name: "Sepolia", chainId: "0xaa36a7", symbol: sepolia, currency: { symbol: "SepoliaETH", decimals: 18 }, rpcs: ['https://eth-sepolia.g.alchemy.com/v2/demo'] },
    { name: "Apothem", chainId: "0x33", symbol: apothem, currency: { symbol: "TXDC", decimals: 18 }, rpcs: ['https://apothem.xdcrpc.com'] },
    { name: "goerli", chainId: "0x5", symbol: goerli, currency: { symbol: "ETH", decimals: 18 }, rpcs: ['https://ethereum-goerli.publicnode.com'] },
    { name: "fantom testnet", chainId: "0xfa2", symbol: fantom, currency: { symbol: "FTM", decimals: 18 }, rpcs: ['https://rpc.testnet.fantom.network'] },
];


