import NavBar from "./NavBar";
import Foruskey from "./Foruskey";
import Instruction from "./Instruction";
import Trx from "./Trx";
import React, { createContext, useState, useEffect } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";

type Props = {};

interface ContextValue {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
  connectWallet(): void;
  contractAddress: string;
  sumof: string | any;
  setsumof: React.Dispatch<React.SetStateAction<string | any>>;
  sumofAddress: string | any;
  setsumofAddress: React.Dispatch<React.SetStateAction<string | any>>;
  validateChain(): void;
}

export const AppContext = createContext<ContextValue | any>(null);
const Cryptia = (props: Props) => {
  const notyf = new Notyf();

  const [show, setShow] = useState<boolean>(true);
  const [, setwallet] = useState<boolean>(false);
  // const [chainid, setchainid] = useState<string | null>("");
  const [sumof, setsumof] = useState<string | any>("");
  const [sumofAddress, setsumofAddress] = useState<string | any>("");

  let contractAddress: string = "0x60BA717Dd36b84557E46690c6163De5dbDc6F6bb";

  const { ethereum }: any = window;

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(contractAddress, abi.abi, provider);

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

    if (chainId !== "0xaa36a7") {
      notyf.error("plz connect to sepolia testnet");
      return;
    }
  };

  useEffect(() => {
    validateChain();
  }, []);

  if (ethereum) {
    ethereum.on("accountsChanged", (address: any) => {
      sessionStorage.setItem("address", address);
      window.location.reload();
    });

    ethereum.on("chainChanged" || "accountsChanged", (chId: any) => {
      accountChecker();
      console.log(chId);
      if (chId !== "0xaa36a7") {
        notyf.error("plz connect to sepolia testnet");
        return;
      }
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

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
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
    connectWallet,
    contractAddress,
    sumof,
    setsumof,
    sumofAddress,
    setsumofAddress,
    validateChain,
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

export default Cryptia;
