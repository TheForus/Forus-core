import { useMemo, useState } from "react";
import { Notyf } from "notyf";
import { ethers } from "ethers";
import { TbTransferIn } from "react-icons/tb";

import { chainOptions } from "../helpers/ChainOptions";

interface ChildProps {
  masterkey: string | any;
  amountTowithdraw: string | any;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
}

function normalizeWalletPrivateKey(rawKey: string) {
  const trimmed = String(rawKey || "").trim();
  const normalized = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;

  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error("Invalid stealth wallet private key.");
  }

  return normalized;
}

function getReadableError(error: any) {
  const rpcMessage =
    error?.error?.message ||
    error?.data?.message ||
    error?.reason ||
    error?.message ||
    "Unknown withdrawal error";

  if (rpcMessage.includes("insufficient funds")) {
    return "The stealth wallet does not have enough ETH to cover gas.";
  }

  if (rpcMessage.includes("execution reverted")) {
    return "The withdrawal transaction was rejected by the network.";
  }

  if (rpcMessage.includes("wrong chain") || rpcMessage.includes("chain")) {
    return "Wrong network selected in wallet. Switch to the same chain used for receiving.";
  }

  if (rpcMessage.includes("Internal JSON-RPC error")) {
    return "The wallet RPC rejected the transaction. This usually means gas settings, chain mismatch, or insufficient funds.";
  }

  return rpcMessage;
}

const Withdraw = ({ masterkey }: ChildProps) => {
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "bottom",
    },
    duration: 5000,
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

  const [buttonLabel, setButtonLabel] = useState<string>("Withdraw");
  const [receipentAdd, setreceipentAdd] = useState<string>("");

  const { ethereum }: any = window;
  const currentNetworkName = sessionStorage.getItem("chain");

  const selectedChain = useMemo(() => {
    return chainOptions.find((chain) => chain.name === currentNetworkName) || null;
  }, [currentNetworkName]);

  const provider = useMemo(() => {
    if (!ethereum) {
      return null;
    }

    return new ethers.providers.Web3Provider(ethereum);
  }, [ethereum]);

  const getExplorerBaseUrl = (chainId?: number) => {
    if (typeof chainId === "number") {
      const matchedChain = chainOptions.find(
        (chain) => Number(chain.chainId) === chainId
      );

      if (matchedChain?.url) {
        return matchedChain.url;
      }
    }

    return selectedChain?.url || sessionStorage.getItem("blockExplorer") || "";
  };

  const clearNotifications = () => {
    try {
      (notyf as any).dismissAll?.();
    } catch (error) {
      console.error("Unable to dismiss existing notifications", error);
    }
  };

  const openTransactionToast = (txUrl: string) => {
    clearNotifications();
    notyf.open({
      type: "success",
      message: `<a href="${txUrl}" target="_blank" rel="noreferrer">View transaction</a>`,
    });

    setTimeout(() => {
      const transactionLink = document.querySelector(
        `.notyf__toast.forus-toast a[href="${txUrl}"]`
      );

      if (transactionLink instanceof HTMLAnchorElement) {
        transactionLink.addEventListener(
          "click",
          () => {
            clearNotifications();
          },
          { once: true }
        );
      }
    }, 0);
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum || !provider) {
        clearNotifications();
        notyf.error("Wallet provider not found. Please connect your wallet first.");
        return;
      }

      if (!masterkey || String(masterkey).trim() === "") {
        clearNotifications();
        notyf.error("No withdraw key found. Open it from Receive first.");
        return;
      }

      if (!receipentAdd || String(receipentAdd).trim() === "") {
        clearNotifications();
        notyf.error("Please enter the recipient address.");
        return;
      }

      if (!ethers.utils.isAddress(receipentAdd)) {
        clearNotifications();
        notyf.error("Invalid recipient address.");
        return;
      }

      const normalizedPrivateKey = normalizeWalletPrivateKey(masterkey);

      setButtonLabel("Preparing Withdrawal...");

      const connectedNetwork = await provider.getNetwork();

      if (selectedChain?.chainId) {
        const expectedChainId = Number(selectedChain.chainId);

        if (connectedNetwork.chainId !== expectedChainId) {
          clearNotifications();
          notyf.error(
            `Wrong network selected. Expected ${selectedChain.name}, got chain ID ${connectedNetwork.chainId}.`
          );
          setButtonLabel("Withdraw");
          return;
        }
      }

      const stealthWallet = new ethers.Wallet(normalizedPrivateKey, provider);
      const stealthAddress = stealthWallet.address;
      const balance = await provider.getBalance(stealthAddress);

      if (balance.isZero()) {
        clearNotifications();
        notyf.error("This stealth wallet has no ETH to withdraw.");
        setButtonLabel("Withdraw");
        return;
      }

      const nonce = await provider.getTransactionCount(stealthAddress, "latest");
      const feeData = await provider.getFeeData();

      const baseTx: ethers.providers.TransactionRequest = {
        from: stealthAddress,
        to: receipentAdd.trim(),
        value: balance,
        nonce,
      };

      const estimatedGasLimit = await stealthWallet.estimateGas(baseTx);
      const gasLimit = estimatedGasLimit.mul(120).div(100);

      const supportsEip1559 =
        feeData.maxFeePerGas &&
        feeData.maxPriorityFeePerGas &&
        feeData.maxFeePerGas.gt(0) &&
        feeData.maxPriorityFeePerGas.gt(0);

      let finalTx: ethers.providers.TransactionRequest;

      if (supportsEip1559) {
        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;
        const maxFeePerGas = feeData.maxFeePerGas!;
        const gasCost = gasLimit.mul(maxFeePerGas);

        if (balance.lte(gasCost)) {
          clearNotifications();
          notyf.error("Insufficient funds to cover gas fee.");
          setButtonLabel("Withdraw");
          return;
        }

        finalTx = {
          ...baseTx,
          value: balance.sub(gasCost),
          gasLimit,
          maxFeePerGas,
          maxPriorityFeePerGas,
        };
      } else {
        const gasPrice =
          feeData.gasPrice && feeData.gasPrice.gt(0)
            ? feeData.gasPrice
            : await provider.getGasPrice();

        const gasCost = gasLimit.mul(gasPrice);

        if (balance.lte(gasCost)) {
          clearNotifications();
          notyf.error("Insufficient funds to cover gas fee.");
          setButtonLabel("Withdraw");
          return;
        }

        finalTx = {
          ...baseTx,
          value: balance.sub(gasCost),
          gasLimit,
          gasPrice,
        };
      }

      if (!finalTx.value || ethers.BigNumber.from(finalTx.value).lte(0)) {
        clearNotifications();
        notyf.error("Nothing left to withdraw after gas.");
        setButtonLabel("Withdraw");
        return;
      }

      setButtonLabel("Sending Withdrawal...");

      const txResponse = await stealthWallet.sendTransaction(finalTx);

      setButtonLabel("Waiting for Confirmation...");
      await txResponse.wait();

      setreceipentAdd("");
      clearNotifications();
      const txUrl = `${getExplorerBaseUrl(connectedNetwork.chainId)}${txResponse.hash}`;
      openTransactionToast(txUrl);
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      clearNotifications();
      notyf.error(getReadableError(error));
    } finally {
      setButtonLabel("Withdraw");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-4 pt-2 text-left">
        <div className="rounded-[26px] border border-slate-700 bg-slate-800/45 p-4 sm:p-5">
          <div className="space-y-6">
            <div>
              <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
                Withdrawal
              </p>
              <p className="mt-1 montserrat-small text-sm text-slate-400">
                Send the full withdrawable ETH balance from the selected stealth address to your recipient wallet.
              </p>
              {selectedChain && (
                <p className="mt-2 montserrat-small text-xs text-slate-500">
                  Active chain: {selectedChain.name}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
                Recipient
              </p>
              <input
                type="text"
                className="montserrat-subtitle flex-1 w-full rounded-2xl border border-slate-600 bg-slate-800/80 px-5 py-5 text-[0.95rem] font-semibold text-gray-200 outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]"
                onChange={(event) => {
                  setreceipentAdd(event.target.value);
                }}
                placeholder="Enter recipient address"
                value={receipentAdd}
              />
            </div>

            <div className="pt-2">
              <button
                onClick={sendTransaction}
                className="montserrat-subtitle flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 px-6 py-[16px] text-center text-[1.05rem] font-bold text-black transition-all duration-200 hover:shadow-[0_14px_40px_rgba(45,212,191,0.25)]"
              >
                <TbTransferIn className="text-[1.3rem] text-inherit" />
                <span>{buttonLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Withdraw;
