import NavBar from "./NavBar";
import Foruskey from "./Foruskey";
import Instruction from "./Instruction";
import Trx from "./Trx";
import React, { createContext, useState, useEffect } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";

import apothem from "../assets/chains/apothem.png";
import goerli from "../assets/chains/goerli.png";
import sepolia from "../assets/chains/sepolia.png";

// chain logo png's


type Props = {};

interface ContextValue {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
  connectWallet(): void;
  contractAddress: string;
  apothemcontractAddress: string;
  chainname: string;
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
  const notyf = new Notyf();

  const [show, setShow] = useState<boolean>(true);
  const [, setwallet] = useState<boolean>(false);
  const [sumof, setsumof] = useState<string | any>("");
  const [sumofAddress, setsumofAddress] = useState<string | any>("");
  const [chainname, setchainname] = useState<string | any>("");

  let contractAddress: string = "0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb";
  let apothemcontractAddress: string =
    "0x5c75A721154B03C8cAA8Beaab9803b1c214D2a3b";

  const { ethereum }: any = window;



  const chainOptions: any = [
    { name: "Sepolia", label: "0xaa36a7", symbol: sepolia },
    { name: "Apothem", label: "0x33", symbol: apothem },
    { name: "goerli", label: "0x5", symbol: goerli },




  const [selectedChain, setSelectedChain] = useState<string | any>(localStorage.getItem("chain"));

  const handleChainChange = async (chainId: any) => {

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

const fetchChainName = async () => {

  //     const provider = new ethers.providers.Web3Provider(ethereum);
  //     const network = await provider.getNetwork();
  //     chainOptions.map((e: any) => {
  //       if (network !== e.name) {
  //         localStorage.setItem("chain", "Unsupprted Network");
  //       }
  //     });
  //   };





}

useEffect(() => {
  const fetchData = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);

    let contract: any;

    switch (selectedChain) {
      case 'Sepolia':
        contract = new ethers.Contract(contractAddress, abi.abi, provider);
        break;

      case 'Apothem':
        contract = new ethers.Contract(apothemcontractAddress, abi.abi, provider);
        break;

      default:
        // Handle the default case if needed
        break;

    }
    const limit = await contract.getTotalAddresses();
    const totalFunds = await contract.getTotalVolume();
    setsumof(limit.toString());
    setsumofAddress(totalFunds / 10 ** 18);
  };
  fetchData();
}, [show]);

const accountChecker = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  sessionStorage.setItem("address", accounts[0]);
};

const validateChain = async () => {
  const chainId = await ethereum.request({ method: "eth_chainId" });
  console.log(chainId);

  if (chainId !== "0xaa36a7" && chainId !== "0x33") {
    notyf.error("unSupported Chain");
    return;
  }
};

useEffect(() => {
  fetchChainName();
  validateChain();
}, []);

if (ethereum) {
  ethereum.on("accountsChanged", (address: any) => {
    accountChecker();
    sessionStorage.setItem("address", address);
    window.location.reload();
  });

  ethereum.on("chainChanged" || "accountsChanged", (chId: any) => {
    validateChain()

  });
} else {
  notyf.error("Plz install metamask");
}

const connectWallet = async (): Promise<void> => {
  if (ethereum === undefined) {
    notyf.error("Plz install metamask");
    return;
  }
  fetchChainName();

  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    sessionStorage.setItem("address", accounts[0]);
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
  chainname,
  apothemcontractAddress,
  handleChainChange,
  selectedChain,
  setSelectedChain,
};

return (
  <AppContext.Provider value={ContextValue}>
    <div className="bg-[#000000]  min-h-[100vh] max-h-max">
      <NavBar />
      <div
        className="md:w-[90%] max-w-[1220px] mx-auto
                  py-8 p-4"
      >
        <Foruskey />
        <div className="flex flex-col-reverse space-y-4 sm:flex-row justify-between p-3 py-16 ">
          <Instruction />
          <Trx />
        </div>
      </div>
    </div>
  </AppContext.Provider>
);
};

export default Forus;
