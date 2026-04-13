import { useEffect, useMemo, useState } from "react";

import { base58, keccak256 } from "ethers/lib/utils";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { ethers } from "ethers";
import { Notyf } from "notyf";
import BigNumber from "bignumber.js";
import { chainOptions } from "../helpers/ChainOptions";
import { BiTransfer } from "react-icons/bi";
import { ERC20ABI } from "../helpers/ERC20ABI";
import { isDetected } from "../checkers/isDetected";
import { useLocation } from "react-router-dom";
import eth from "../assets/eth.png";

const ec = new EllipticCurve.ec("secp256k1");

function toFixedHexByte(value: number) {
  return Number(value).toString(16).padStart(2, "0");
}

function buildSharedSecretPrefix(secretBytes: number[]) {
  if (!secretBytes || secretBytes.length < 2) {
    throw new Error("Unable to derive stealth secret prefix.");
  }

  return `0x${toFixedHexByte(secretBytes[0])}${toFixedHexByte(secretBytes[1])}`;
}

const TransferPanel = () => {
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "bottom",
    },
    duration: 0,
    dismissible: true,
    types: [
      {
        type: "error",
        background: "#dc2626",
        icon: { className: "notyf__icon--error", tagName: "i" },
        className: "forus-toast",
      },
      {
        type: "success",
        background: "#14b8a6",
        icon: false,
        className: "forus-toast",
      },
    ],
  });

  const location = useLocation();
  const { ethereum }: any = window;

  let x_cor: string | "";
  let y_cor: string | "";
  let sharedSecret: string | "";

  const [token, settoken] = useState<string | "">("");
  const [forusKey, setforusKey] = useState<string | "">("");
  const [amount, setamount] = useState<string | "">("");
  const [byDefault, setbyDefault] = useState<string>("ETH");
  const [chainList, setchainList] = useState<any>([]);
  const [txId, settxID] = useState<string | "">("");
  const [ContractAddress, setContractAddress] = useState<string | any>("");
  const [activeChainName, setActiveChainName] = useState<string>("");
  const [waiting, setwaiting] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState<string>("Transfer");
  const [walletBalance, setWalletBalance] = useState<string>("");

  const provider = useMemo(() => {
    return new ethers.providers.Web3Provider(ethereum);
  }, [ethereum]);

  let receipentAddress: string;

  const getFeeOverrides = async (value?: ethers.BigNumber) => {
    const feeData = await provider.getFeeData();
    const latestBlock = await provider.getBlock("latest");

    const fallbackPriorityFee = ethers.utils.parseUnits("0.1", "gwei");
    const priorityFee =
      feeData.maxPriorityFeePerGas && feeData.maxPriorityFeePerGas.gt(0)
        ? feeData.maxPriorityFeePerGas
        : fallbackPriorityFee;

    const baseFee =
      latestBlock?.baseFeePerGas ||
      feeData.maxFeePerGas ||
      feeData.gasPrice ||
      ethers.utils.parseUnits("0.2", "gwei");

    const maxFeePerGas =
      feeData.maxFeePerGas &&
      feeData.maxFeePerGas.gt(baseFee.add(priorityFee))
        ? feeData.maxFeePerGas
        : baseFee.mul(2).add(priorityFee);

    return value
      ? {
          value,
          maxFeePerGas,
          maxPriorityFeePerGas: priorityFee,
        }
      : {
          maxFeePerGas,
          maxPriorityFeePerGas: priorityFee,
        };
  };

  const getConnectedAddress = async () => {
    if (!ethereum) {
      notyf.error("Please install MetaMask");
      return "";
    }

    try {
      let accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts || accounts.length === 0) {
        accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
      }

      if (!accounts || accounts.length === 0) {
        notyf.error("Please connect your wallet to continue");
        return "";
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      sessionStorage.setItem("address", address);
      return address;
    } catch (e: any) {
      notyf.error(e?.message || "Unable to connect wallet");
      return "";
    }
  };

  const getConnectedAddressSilent = async () => {
    if (!ethereum) {
      return "";
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts || accounts.length === 0) {
        return "";
      }

      return accounts[0];
    } catch {
      return "";
    }
  };

  const connectNetwork = async () => {
    try {
      let activeChain = null;

      if (ethereum) {
        const chainId = await ethereum.request({ method: "eth_chainId" });
        activeChain = chainOptions.find(
          (chain) => chain.chainId.toLowerCase() === String(chainId).toLowerCase()
        );
      }

      if (!activeChain) {
        const currentNetwork = sessionStorage.getItem("chain");
        activeChain = chainOptions.find((chain) => currentNetwork === chain.name);
      }

      if (activeChain) {
        setActiveChainName(activeChain.name);
        setbyDefault(activeChain.currency.symbol);
        settxID(activeChain.url);
        setContractAddress(activeChain.contract);
        setchainList(
          activeChain.tokens.filter((item: any) => item.name === "ETH")
        );
        return activeChain;
      }

      setActiveChainName("");
      setContractAddress("");
      setchainList([]);
      return null;
    } catch (error) {
      console.error("Unable to resolve active chain", error);
      setActiveChainName("");
      setContractAddress("");
      setchainList([]);
      return null;
    }
  };

  useEffect(() => {
    connectNetwork();
  }, [ethereum]);

  useEffect(() => {
    const loadBalance = async () => {
      if (!provider || !ethereum) {
        setWalletBalance("");
        return;
      }

      const address = await getConnectedAddressSilent();
      if (!address) {
        setWalletBalance("");
        return;
      }

      const balance = await provider.getBalance(address);
      const formatted = Number(ethers.utils.formatEther(balance)).toFixed(6);
      setWalletBalance(formatted);
    };

    loadBalance().catch(() => {
      setWalletBalance("");
    });
  }, [provider, ethereum]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const key = searchParams.get("key");

    if (key) {
      setforusKey(key);
    }
  }, [location.search]);

  const validatingForuskey = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.value;

    if (
      key !== "" &&
      key.slice(0, 2).toLowerCase() !== "fk" &&
      (key.length > 49 || key.length < 49)
    ) {
      notyf.error("Invalid address");
    }

    setforusKey(key);
  };

  const validateInputs = () => {
    if (forusKey === "" || amount === "") {
      notyf.error("Please fill the inputs");
      return false;
    }

    return true;
  };

  let rec_fkey: EC.KeyPair | any;

  const validateForusKey = async () => {
    try {
      if (forusKey.slice(0, 2).toLowerCase() === "fk") {
        const _forusKey = forusKey.slice(2);
        const decode_forusKey = base58.decode(_forusKey);
        const decodedkey = decode_forusKey.subarray(0, 33);
        rec_fkey = ec.keyFromPublic(decodedkey, "hex");
      } else {
        notyf.error("Invalid key");
      }
    } catch (e: any) {
      notyf.error(e.message);
    }
  };

  const setUpStealthAddress = async () => {
    await validateForusKey();

    try {
      if (!rec_fkey) {
        notyf.error("Invalid Forus key");
        return false;
      }

      const keypair: EC.KeyPair = ec.genKeyPair();
      const ephemeralPkey = keypair.getPublic();
      const calculateSecret = keypair.derive(rec_fkey.getPublic());
      const calculateSecretBytes = calculateSecret.toArray();
      const hashedSecret = ec.keyFromPrivate(keccak256(calculateSecretBytes));
      const publicKey = rec_fkey
        ?.getPublic()
        ?.add(hashedSecret.getPublic())
        ?.encode("array", false);

      const _publicKey = publicKey?.splice(1) || [];
      const address = keccak256(_publicKey);
      const _HexAddress = address.slice(-40);

      receipentAddress = "0x" + _HexAddress;
      x_cor = `0x${ephemeralPkey?.getX().toString(16, 64)}`;
      y_cor = `0x${ephemeralPkey?.getY().toString(16, 64)}`;
      sharedSecret = buildSharedSecretPrefix(calculateSecretBytes);
    } catch (e: any) {
      notyf.error(e?.message || "Unable to generate stealth address");
      return false;
    }

    return true;
  };

  const transferFundsNative = async () => {
    if (!validateInputs()) return;

    const connectedAddress = await getConnectedAddress();
    if (!connectedAddress) return;

    const resolvedChain = await connectNetwork();
    if (!resolvedChain || !resolvedChain.contract) {
      notyf.error("Contract address is not configured for the selected network");
      return;
    }

    const ready = await setUpStealthAddress();
    if (!ready) return;

    setwaiting(true);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ContractAddress, Abi.abi, signer);
      const valueToSend = ethers.utils.parseEther(amount);
      const transactionParameters = await getFeeOverrides(valueToSend);

      const transfer = await contract.Transfer(
        x_cor,
        y_cor,
        sharedSecret,
        receipentAddress,
        transactionParameters
      );

      setforusKey("");
      setamount("");
      const txUrl = `${txId}${transfer.hash}`;
      notyf.open({
        type: "success",
        message: `Transfer sent. <a href="${txUrl}" target="_blank" rel="noreferrer">Click to view transaction</a>`,
      });
    } catch (e: any) {
      notyf.error(e.message);
    } finally {
      setwaiting(false);
    }
  };

  const transferToken = async () => {
    if (!validateInputs()) return;

    const connectedAddress = await getConnectedAddress();
    if (!connectedAddress) return;

    const resolvedChain = await connectNetwork();
    const selectedToken =
      token || chainList.find((item: any) => item.name === byDefault)?.address || "";

    if (!resolvedChain || !resolvedChain.contract || !selectedToken) {
      notyf.error("Token or contract address is not configured");
      return;
    }

    const ready = await setUpStealthAddress();
    if (!ready) return;

    setwaiting(true);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(resolvedChain.contract, Abi.abi, signer);
      const amountParams: any = ethers.utils.parseUnits(amount, 18);
      const feeOverrides = await getFeeOverrides();
      const transferERC20 = await contract.TransferERC20(
        x_cor,
        y_cor,
        sharedSecret,
        selectedToken,
        receipentAddress,
        amountParams,
        feeOverrides
      );

      await transferERC20.wait();
      setforusKey("");
      setamount("");
      const txUrl = `${txId}${transferERC20.hash}`;
      notyf.open({
        type: "success",
        message: `Transfer sent. <a href="${txUrl}" target="_blank" rel="noreferrer">Click to view transaction</a>`,
      });
    } catch (e: any) {
      notyf.error(e.message);
    } finally {
      setwaiting(false);
    }
  };

  const approve = async () => {
    const resolvedChain = await connectNetwork();
    const selectedToken =
      token || chainList.find((item: any) => item.name === byDefault)?.address || "";
    const msgSender = await getConnectedAddress();

    if (!selectedToken || !resolvedChain || !resolvedChain.contract || !msgSender) {
      notyf.error("Token or contract address is not configured");
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(selectedToken, ERC20ABI, signer);
      const allowance = await contract.allowance(msgSender, resolvedChain.contract);
      const bigNumber = new BigNumber(allowance._hex);
      const parsedAllowance: number = bigNumber.toNumber() / 10 ** 18;

      if (parsedAllowance < Number(amount)) {
        const approvedAmount: any = ethers.utils.parseUnits(amount, 18);
        const feeOverrides = await getFeeOverrides();
        setButtonState("Approving..");

        const approveTx = await contract.approve(
          resolvedChain.contract,
          approvedAmount,
          feeOverrides
        );

        await approveTx.wait();
        setButtonState("Transfer");
        notyf.success("Approved");
        setTimeout(() => {
          transferToken();
        }, 2000);
      } else {
        transferToken();
      }
    } catch (e: any) {
      notyf.error(e.message);
    }
  };

  const proceed = async () => {
    isDetected();

    const selectedToken =
      token || chainList.find((item: any) => item.name === byDefault)?.address || "";
    const msgSender = await getConnectedAddress();

    if (!selectedToken || !msgSender) {
      notyf.error("Token address is not configured");
      return;
    }

    try {
      const contract = new ethers.Contract(selectedToken, ERC20ABI, provider);
      const balance = await contract.balanceOf(msgSender);
      const bigNumber = new BigNumber(balance._hex);
      const erc20Balance: number = bigNumber.toNumber() / 10 ** 18;

      if (erc20Balance >= Number(amount)) {
        await approve();
      } else {
        notyf.error("insufficient token balance");
      }
    } catch (err: any) {
      notyf.error(err.message);
    }
  };

  const transferFunds = async () => {
    const isNativeAsset =
      byDefault === "ETH" &&
      !!activeChainName &&
      chainOptions.some(
        (chain: any) =>
          chain.name === activeChainName && chain.currency.symbol === byDefault
      );

    if (isNativeAsset) {
      await transferFundsNative();
    } else {
      await proceed();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 text-left">
      <div className="rounded-[26px] border border-slate-700 bg-slate-800/45 p-4 sm:p-5">
        <div className="space-y-6 text-left">
          <div>
            <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
              Transfer
            </p>
            <p className="mt-1 montserrat-small text-sm text-slate-400">
              Enter the receiver&apos;s Forus key, choose the asset, and send funds securely.
            </p>
          </div>

          <div className="space-y-3">
            <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
              Recipient
            </p>
            <input
              className="montserrat-subtitle w-full rounded-2xl border border-slate-600 bg-slate-800/80 px-5 py-[18px] text-[0.95rem] font-semibold text-gray-200 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]"
              type="text"
              onChange={validatingForuskey}
              placeholder="Enter receiver's Forus Key"
              value={forusKey}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
                Amount
              </p>
              <p className="montserrat-small text-xs text-slate-500">
                Choose asset and value
              </p>
            </div>
            <div className="relative flex justify-center rounded-2xl border border-slate-600 bg-slate-800/80">
              <input
                className="montserrat-subtitle w-full bg-transparent py-[18px] pl-5 pr-[124px] text-[1rem] font-semibold text-gray-100 placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-transparent focus:shadow-none"
                value={amount}
                type="text"
                placeholder={`0.1  ${byDefault}`}
                onChange={(e) => setamount(e.target.value)}
              />

              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
                <div className="flex min-w-[74px] items-center justify-end gap-2 rounded-xl font-semibold text-cyan-300">
                  <img
                    src={eth}
                    alt="ETH"
                    className="h-[18px] w-[18px] rounded-full"
                  />
                  <p className="montserrat-subtitle">{byDefault}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end text-xs text-slate-400">
              <span className="montserrat-small">Max:</span>
              <span className="montserrat-subtitle ml-1">{walletBalance || "--"}</span>
              <img
                src={eth}
                alt="ETH"
                className="ml-2 h-[14px] w-[14px] rounded-full opacity-80"
              />
              <span className="montserrat-small ml-1">ETH</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                transferFunds();
              }}
              className="montserrat-subtitle flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 px-6 py-[16px] text-center text-[1rem] font-bold text-black transition-all duration-200 hover:shadow-[0_14px_40px_rgba(45,212,191,0.25)]"
            >
              {waiting === false ? (
                <>
                  <BiTransfer className="text-[1.3rem] text-inherit" />
                  <span>{buttonState}</span>
                </>
              ) : (
                "transfering..."
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransferPanel;
