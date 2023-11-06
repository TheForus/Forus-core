export const SwitchChain = async(customChain : any, chainId : string) => {

    const { ethereum }: any = window;
    await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [customChain],
      });
  
      try {
        if (ethereum) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId }],
          });
        } else {
          console.error("MetaMask not found or not connected.");
        }
      } catch (error) {
        console.error("Error switching Ethereum chain:", error);
      }

}

