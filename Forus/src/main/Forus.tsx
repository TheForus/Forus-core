import NavBar from "./NavBar";
import Foruskey from "./Foruskey";
import Instruction from "./Instruction";
import Transactions from "./Transactions";
import React, { createContext, useState, useEffect } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { BigNumber, ethers } from "ethers";
import { chainOptions } from "../helper/ChainOptions";
import {
  apothemcontractAddress,
  fantomcontractAddress,
  sepoliacontractAddress,
} from "../helper/contractAddresses";

type Props = {};

interface ContextValue {
  show: string;
  setShow: React.Dispatch<React.SetStateAction<string | any>>;
  connectWallet(): void;
  contractAddress: string;
  apothemcontractAddress: string;
  selectedChain: string;
  setSelectedChain: React.Dispatch<React.SetStateAction<string | any>>;
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
  const [sumof, setsumof] = useState<string | any>("");
  const [sumofAddress, setsumofAddress] = useState<string | any>("");
  const [contractAddress, setcontractAddress] = useState<string | any>("");

  const { ethereum }: any = window;

  const [selectedChain, setSelectedChain] = useState<string | any>(
    sessionStorage.getItem("chain")
  );

  let contract: any

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    contract = new ethers.Contract(contractAddress, abi.abi, provider);

  }




  //helper 

  const addingChain = async (customChain: any, chainId: string | '') => {

    await ethereum.request({ method: 'wallet_addEthereumChain', params: [customChain] });

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
  }




  //wallet connect logic

  const handleChainChange = async (chainId: any) => {


    chainOptions.map(chain => {

      if (sessionStorage.getItem("chain") !== chain.name) {
        return
      }

      else {

        const customChain = {
          chainId: chain.chainId, // Replace with your custom chain's ID
          chainName: chain.name, // Replace with your chain's name
          nativeCurrency: {
            name: chain.name, // Replace with your native currency name
            symbol: chain.currency.symbol, // Replace with your native currency symbol
            decimals: chain.currency.decimals,
          },
          rpcUrls: chain.rpcs, // Replace with your chain's RPC URL
        };

        console.log(customChain)

        // Add the custom chain to MetaMask

        addingChain(customChain, chain.chainId)








      }


    });
  }


  const validateChain = async () => {


    const chainId = await ethereum.request({ method: "eth_chainId" });

    switch (chainId) {
      case "0x33":
        sessionStorage.setItem("chain", "Apothem");

        break;

      case "0xaa36a7":
        sessionStorage.setItem("chain", "Sepolia");

        break;

      case "0xfa2":
        sessionStorage.setItem("chain", "fantom testnet");

        break;

      default:
        sessionStorage.setItem("chain", "Unsupported");

        break;
    }
  };


  useEffect(() => {
    const fetchData = async () => {

      switch (selectedChain) {
        case "Sepolia":
          setcontractAddress(sepoliacontractAddress);
          break;
        case "Apothem":
          setcontractAddress(apothemcontractAddress);
          break;
        case "fantom testnet":
          setcontractAddress(fantomcontractAddress);
          break;
        default:
          break;
      }
      const limit = await contract.getTotalAddresses();
      const totalFunds = await contract.getTotalVolume();
      setsumof(limit.toString());
      setsumofAddress(totalFunds / 10 ** 18);
    };

    fetchData();

  }, [show, []]);

  const accountChecker = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    sessionStorage.setItem("address", accounts[0]);
    
    const provider = new ethers.providers.Web3Provider(ethereum);

    try {
      const balance = await provider.getBalance(sessionStorage.getItem("address") || '');
      console.log(ethers.utils.formatEther(balance).toString())
      const bignumber = BigNumber.from(balance);
      // console.log(Bignumber)
  
      // Convert the BigNumber to a JavaScript number
      const convertedNumber = bignumber.toNumber()/ 10 ** 18;
      
      console.log(convertedNumber);
    }
    catch (e: any) {
      console.log(e);
    }
  };


  useEffect(() => {
    validateChain();


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
    if (ethereum === undefined) {
      notyf.error("Plz install metamask");
      return;
    }

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
    contractAddress,
    sumof,
    setsumof,
    sumofAddress,
    setsumofAddress,
    validateChain,

    apothemcontractAddress,
    handleChainChange,
    selectedChain,
    setSelectedChain,
  };

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="bg-[#000000]  min-h-[95vh] max-h-max">
        {/* <div className="flex items-center justify-between"> */}
        <NavBar />
        {/* </div> */}
        <div
          className="md:w-[90%] max-w-[1220px] mx-auto
                  py-8 p-4"
        >
          <Foruskey />
          <div className="flex flex-row-reverse sm:flex-row justify-between p-3 py-16 ">
            <Instruction />
            <Transactions />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Forus;
