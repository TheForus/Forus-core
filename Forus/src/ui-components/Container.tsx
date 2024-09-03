import NavBar from "./NavHeader";
import Foruskey from "./keys";
import Instruction from "./Instruction";
import Transactions from "./Tx-wrapper";
import React, { createContext, useState, useEffect, useMemo } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";
import { chainOptions } from "../helpers/ChainOptions";
import HeaderRibbon from "../components/HeaderRibbon";
import { ValidateChainData } from "../checkers/ValidateChainData";
import { SwitchChain } from "../helpers/SwitchChain";
import { isDetected } from "../checkers/isDetected";
import CopyRight from "./CopyRight";

type Props = {};

interface ContextValue {
  show: string;
  setShow: React.Dispatch<React.SetStateAction<string | any>>;
  connectWallet(): void;
  userBalance: string;
  accountChecker(): void;
  selectedChain: string;
  totalfunds: string | any;
  settotalfunds: React.Dispatch<React.SetStateAction<string | any>>;
  totalAddress: string | any;
  settotalAddress: React.Dispatch<React.SetStateAction<string | any>>;
  chainOptions: [] | any;
  handleChainChange(chainId: any): void | any;
  address : string
}

export const AppContext = createContext<ContextValue | any>(null);

const Container = (props: Props) => {
  //start
  const notyf = new Notyf();

  const [show, setShow] = useState<string>("transfer");
  const [totalfunds, settotalfunds] = useState<string | any>("0");
  const [totalAddress, settotalAddress] = useState<string | any>("0");
  const [address, setAddress] = useState<string | any>("");

  const selectedChain: string | any = sessionStorage.getItem("chain");

  const ethereum = useMemo(() => {
    const { ethereum }: any = window;
    if (typeof ethereum !== "undefined") {
      return ethereum;
    } else {
      // Handle the case where Ethereum is not available
      return null; // or some other default value
    }
  }, []);

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

        SwitchChain(customChain, chain.chainId);
      }
    });
  };

  useEffect(() => {
    const fetchCurrentChainData = async () => {
      try {
        const chainId = await ethereum.request({ method: "eth_chainId" });
        const chain = chainOptions.find((option) => option.chainId === chainId);

        if (chain) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const theContract = new ethers.Contract(
            chain.contract,
            abi.abi,
            provider
          );
          const [totalAddresses, totalFunds] = await Promise.all([
            theContract.gettotalStealthAddresses(),
            theContract.getTotalVolume(),
          ]);

          settotalAddress(totalAddresses.toString());
          settotalfunds(totalFunds / 10 ** 18);
        }
      } catch (error) {
        console.error("Error fetching chain data:", error);
      }
    };

    ethereum ? fetchCurrentChainData() : null;
  }, [show, ethereum]);

  const [userBalance, setUserBalance] = useState<string>("");

  const accountChecker = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get the user's address

      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(accounts[0]);
 

      // Get the signer (the account that is connected)
      const signer = provider.getSigner();
  
      // Get the connected account address
      const address = await signer.getAddress();
 
      sessionStorage.setItem("address", address);
      setAddress(address);
     
  
      sessionStorage.setItem(
        "balance",
        ethers.utils.formatEther(balance).toString().slice(0, 5) +
          " " +
          sessionStorage.getItem("symbol")
      );
    } catch (e: any) {
      console.log(e);
      notyf.error(e.message);
    }
  };

  useEffect(() => {

    accountChecker();
    ValidateChainData();

  }, [ethereum]);

  try {
    if (ethereum) {
      ethereum.on("accountsChanged", (address: any) => {
        accountChecker();
        sessionStorage.setItem("address", address);
        window.location.reload();
      });

      ethereum.on("chainChanged", (chId: any) => {
        window.location.reload();
        accountChecker();
        ValidateChainData();
      });
    } else {
      notyf.error("Plz install metamask");
    }
  } catch (e: any) {
    notyf.error(e.message);
  }

  const connectWallet = async (): Promise<void> => {
    isDetected();

    try {
      accountChecker();
      ValidateChainData();
    } catch (e: any) {
      notyf.error(e);
    }
  };

  const ContextValue: ContextValue = {
    show,
    setShow,
    chainOptions,
    connectWallet,
    totalfunds,
    userBalance,
    settotalfunds,
    totalAddress,
    settotalAddress,
    handleChainChange,
    selectedChain,
    accountChecker,
    address
  };

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="overflow-hidden bg-gradient-to-tr from-black via-black/80 to-transparent relative w-full h-full">
        <div
          className="absolute top-0 right-0 w-full h-full rounded-md bg-gradient-to-tr
         from-blue-400 to-blue-600 z-[-10]"
        ></div>
        <div className="bg-black/80 max-h-max min-h-[100vh] lg:overflow-hidden">

          {/* <HeaderRibbon /> */}


          <NavBar />

          <div
            className="md:w-[100%]  max-w-[1280px] mx-auto
            py-8 p-4"
          >
            <div className="relative m-auto lg:w-[94%] xl:w-[96%] w-[100%] h-full">
              <div
                className="border border-gray-500 shadow-gray-800 absolute top-0 right-0 w-full h-full rounded-md 
            bg-gradient-to-tr from-blue-400 to-black/20"
              ></div>
              <Foruskey />
            </div>
            <div
              className="flex lg:flex-row lg:justify-between justify-between 
          flex-col-reverse  pt-16 pb-6 "
            >
              <Instruction />
              <Transactions />
            </div>
          </div>
          <CopyRight />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Container;
