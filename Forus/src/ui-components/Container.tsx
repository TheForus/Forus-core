import NavBar from "./NavHeader";
import Transactions from "./Tx-wrapper";
import React, { createContext, useState, useEffect, useMemo } from "react";
import { Notyf } from "notyf";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";
import { chainOptions } from "../helpers/ChainOptions";
import { ValidateChainData } from "../checkers/ValidateChainData";
import { SwitchChain } from "../helpers/SwitchChain";
import { isDetected } from "../checkers/isDetected";
import CopyRight from "./CopyRight";
import { useLocation } from "react-router-dom";

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
  address: string;
}

export const AppContext = createContext<ContextValue | any>(null);

const Container = (props: Props) => {
  const notyf = new Notyf();
  const location = useLocation();

  const [show, setShow] = useState<string>("keygen");
  const [totalfunds, settotalfunds] = useState<string | any>("0");
  const [totalAddress, settotalAddress] = useState<string | any>("0");
  const [address, setAddress] = useState<string | any>("");

  const selectedChain: string | any = sessionStorage.getItem("chain");

  const ethereum = useMemo(() => {
    const { ethereum }: any = window;
    if (typeof ethereum !== "undefined") {
      return ethereum;
    } else {
      return null;
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

        SwitchChain(customChain, chain.chainId);
      }
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const key = searchParams.get("key");

    if (key) {
      setShow("transfer");
    }
  }, [location.search]);

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

  const syncConnectedAccount = async () => {
    try {
      if (!ethereum) return;

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts || accounts.length === 0) {
        sessionStorage.removeItem("address");
        setAddress("");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const signer = provider.getSigner();
      const nextAddress = await signer.getAddress();

      sessionStorage.setItem("address", nextAddress);
      setAddress(nextAddress);
      sessionStorage.setItem(
        "balance",
        ethers.utils.formatEther(balance).toString().slice(0, 5) +
          " " +
          sessionStorage.getItem("symbol")
      );
    } catch (e: any) {
    }
  };

  const accountChecker = async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const signer = provider.getSigner();
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
      notyf.error(e.message);
    }
  };

  useEffect(() => {
    syncConnectedAccount();
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
    address,
  };

  return (
    <AppContext.Provider value={ContextValue}>
      <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,#13385b_0%,#08111d_34%,#02050b_68%,#000000_100%)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_24%)]"
        ></div>
        <div className="relative min-h-screen bg-black/35">
          <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 sm:px-5 sm:pt-8 lg:px-8">
            <div className="mx-auto w-full max-w-5xl rounded-[32px] border border-slate-800/80 bg-[linear-gradient(180deg,rgba(12,24,40,0.92)_0%,rgba(7,13,23,0.9)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-sm">
              <NavBar />

              <div className="px-4 pb-8 sm:px-5 lg:px-8">
                <div className="mx-auto w-full max-w-4xl text-center">
                  <p className="montserrat-small text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400/80">
                    The Forus
                  </p>
                  <h1 className="mt-4 montserrat-subheading text-3xl font-bold text-slate-200 sm:text-4xl">
                    Frictionless Shielded Transfers
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl montserrat-small text-sm text-slate-300 sm:text-base">
                    A user-friendly privacy infrastructure , enabling non-interactive stealth address reception to protect your on-chain identity.
                  </p>
                </div>

                <div className="pt-8">
                  <Transactions />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 pb-8 sm:px-5 lg:px-8">
            <CopyRight />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default Container;
