import NavBar from "./NavBar";
import Foruskey from "./Foruskey";
import Instruction from "./Instruction";
import Transactions from "./Transactions";
import React, { createContext, useState, useEffect } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
// import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";
import { chainOptions } from "../helper/ChainOptions";
import HeaderRibbon from "../components/HeaderRibbon";

type Props = {};

interface ContextValue {
  show: string;
  setShow: React.Dispatch<React.SetStateAction<string | any>>;
  connectWallet(): void;
  userBalance: string;
  selectedChain: string;
  sumof: string | any;
  setsumof: React.Dispatch<React.SetStateAction<string | any>>;
  sumofAddress: string | any;
  setsumofAddress: React.Dispatch<React.SetStateAction<string | any>>;
  chainOptions: [] | any;
  validateChain(): void;
  handleChainChange(chainId: any): void | any;
}

export const AppContext = createContext<ContextValue | any>(null);
const Forus = (props: Props) => {
  //start
  const notyf = new Notyf();

  const [show, setShow] = useState<string>("transfer");
  const [, setwallet] = useState<boolean>(false);
  const [sumof, setsumof] = useState<string | any>("0");
  const [sumofAddress, setsumofAddress] = useState<string | any>("0");

  const { ethereum }: any = window;

  const selectedChain: string | any = sessionStorage.getItem("chain");

  const isWallet = async () => {
    if (ethereum === undefined) {
      notyf.error("Plz install metamask");
      return;
    }
  };

  const addingChain = async (customChain: any, chainId: string | "") => {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [customChain],
    });

    // Now, switching to the custom chain

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
  };

  const handleChainChange = async (chainId: any) => {
    chainOptions.map((chain) => {
      if (sessionStorage.getItem("chain") !== chain.name) {
        return;
      } else {
        const customChain = {
          chainId: chain.chainId,
          chainName: chain.name,
          nativeCurrency: {
            name: chain.name,
            symbol: chain.currency.symbol,
            decimals: chain.currency.decimals,
          },
          rpcUrls: chain.rpcs,
        };

        // Add the custom chain to MetaMask

        addingChain(customChain, chain.chainId);
      }
    });
  };

  const validateChain = async () => {
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
  };

  useEffect(() => {
    const fetchCurrentChainData = async () => {
      try {
        const chainId = await ethereum.request({ method: "eth_chainId" });
        const chain = chainOptions.find((option) => option.chainId === chainId);

        // if (chain) {
        //   const provider = new ethers.providers.Web3Provider(ethereum);
        //   const theContract = new ethers.Contract(chain.contract, abi.abi, provider);
        //   const [limit, totalFunds] = await Promise.all([
        //     theContract.getTotalAddresses(),
        //     theContract.getTotalVolume(),
        //   ]);

        //   setsumof(limit.toString());
        //   setsumofAddress(totalFunds / 10 ** 18);
        // }
      } catch (error) {
        console.error("Error fetching chain data:", error);
      }
    };

    fetchCurrentChainData();
  }, [show, []]);

  const [userBalance, setUserBalance] = useState<string>("");

  const accountChecker = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    sessionStorage.setItem("address", accounts[0]);

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(accounts[0]);
      setUserBalance(
        ethers.utils.formatEther(balance).toString().slice(0, 5) +
          " " +
          sessionStorage.getItem("symbol")
      );
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    validateChain();
    accountChecker();
  }, []);

  if (ethereum) {
    ethereum.on("accountsChanged", (address: any) => {
      accountChecker();
      sessionStorage.setItem("address", address);
      window.location.reload();
    });

    ethereum.on("chainChanged", (chId: any) => {
      window.location.reload();
      validateChain();
    });
  } else {
    notyf.error("Plz install metamask");
  }

  const connectWallet = async (): Promise<void> => {
    isWallet();

    try {
      await accountChecker();
      validateChain();

      setwallet(true);
    } catch (e: any) {
      notyf.error(e);
    }
  };

  const ContextValue: ContextValue = {
    show,
    setShow,
    chainOptions,
    connectWallet,
    sumof,
    userBalance,
    setsumof,
    sumofAddress,
    setsumofAddress,
    validateChain,
    handleChainChange,
    selectedChain,
  };

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="bg-gradient-to-tr from-black via-black/80 to-transparent relative w-full h-full">
        <div
          className="absolute top-0 right-0 w-full h-full rounded-md bg-gradient-to-tr
         from-blue-400 to-blue-600 z-[-10]"
        ></div>
        <div className="bg-black/80 max-h-max min-h-[100vh] lg:overflow-hidden">
          <HeaderRibbon />

          <NavBar />

          <div
            className="md:w-[90%]  max-w-[1220px] mx-auto
            py-8 p-4"
          >
            <div className="relative  ml-11  xl:w-[90%] w-[60%] h-full">
              <div className="border border-gray-500 shadow-gray-800 absolute top-0 right-0 w-full h-full rounded-md 
            bg-gradient-to-tr from-blue-400 to-black/20"></div>
              <Foruskey />
            </div>
            <div
              className="flex lg:flex-row lg:justify-between lg:py-16 p-3
          flex-col-reverse items-start pt-16 pb-6"
            >
              <Instruction />
              <Transactions />
            </div>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Forus;