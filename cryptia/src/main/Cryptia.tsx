import Navmain from "./Navmain";
import Cr from "./Cr";
import Instruction from "./Instruction";
import Trx from "./Trx";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

type Props = {};

interface ContextValue {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
  connectWallet(): void;
  chainid: string | null;
  contractAddress: string;
  sumof: string | any;
  setsumof: React.Dispatch<React.SetStateAction<string | any>>;
  sumofAddress: string | any;
  setsumofAddress: React.Dispatch<React.SetStateAction<string | any>>;
  validateChain(): void
}

export const AppContext = createContext<ContextValue | any>(null);
const Cryptia = (props: Props) => {
  const notyf = new Notyf();

  const [show, setShow] = useState<boolean>(true);
  const [, setwallet] = useState<boolean>(false);
  const [chainid, setchainid] = useState<string | null>("");
  const [sumof, setsumof] = useState<string | any>("");
  const [sumofAddress, setsumofAddress] = useState<string | any>("");
  let contractAddress: string = "0x6340e1ed7DCe39ccA016C1805286Aa11536b4F3a";

  let chainId: string;

  const { ethereum }: any = window;

  const accountChecker = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const address = accounts[0];
    sessionStorage.setItem("address", address);
  };


  const validateChain = async () => {
    const chainId = await ethereum.request({ method: "eth_chainId" });

    if (chainId !== "0x1e15") {
      notyf.error("plz connect to canto testnet");
      return ;
    }

  };

  useEffect(() => {
    validateChain();
  }, []);

  useMemo(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", () => {
        accountChecker();
        window.location.reload();
      });
    }
    ethereum.on("chainChanged" || "accountsChanged", (chId: any) => {
      console.log(chId);
      if (chId !== "0x1e15") {
        notyf.error("plz connect to canto testnet");
        return;
      }
      window.location.reload();
    });
  }, []);


  const connectWallet = async (): Promise<void> => {
    if (ethereum === undefined) {
      alert("Plz install metamask");
      return;
    }
    try {
      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        sessionStorage.setItem("address", accounts[0]);

        chainId = await ethereum.request({ method: "eth_chainId" });
        setchainid(chainId);
        console.log(chainId);

        if (chainId !== "0x1e15") {
          notyf.error("plz connect to canto testnet");
        }
      }
      setwallet(true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const ContextValue: ContextValue = {
    show,
    setShow,
    connectWallet,
    chainid,
    contractAddress,
    sumof,
    setsumof,
    sumofAddress,
    setsumofAddress,
    validateChain
  };

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="bg-[#f4fffc] md:h-[98vh]">
        <Navmain />
        <div
          className="md:w-[90%] max-w-[1020px] mx-auto
                  py-8 p-4"
        >
          <Cr />
          <div className="flex flex-col-reverse space-y-4 sm:flex-row justify-between p-3 py-4">
            <Instruction />
            <Trx />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Cryptia;
