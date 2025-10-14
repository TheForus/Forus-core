
import { chainOptions } from "../helpers/ChainOptions";

export const ValidateChainData = async () => {


  const { ethereum }: any = window;
  try {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    const matchingChain = chainOptions.find(
      (chain) => chain.chainId === chainId
    );

    sessionStorage.setItem(
      "chain",
      matchingChain ? matchingChain.name : "unSupported Chain"
    );
    sessionStorage.setItem(
      "symbol",
      matchingChain ? matchingChain.currency.symbol : ""
    );
  } catch (error) {

  }

}



