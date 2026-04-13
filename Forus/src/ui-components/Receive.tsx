import { useEffect, useMemo, useRef, useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { AiOutlineUpload } from "react-icons/ai";
import { BigNumber, ethers } from "ethers";
import {
  MdHistory,
  MdOutlineDone,
  MdOutlineRefresh,
} from "react-icons/md";
import ToolTip from "../helpers/ToopTip";
import { isDetected } from "../checkers/isDetected";
import { chainOptions } from "../helpers/ChainOptions";
import eth from "../assets/eth.png";
import { TbTransferIn, TbShieldCheck } from "react-icons/tb";

const ec = new EllipticCurve.ec("secp256k1");
const PAGE_SIZE = 10;

interface ChildProps {
  withdrawFunction: () => void;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
  setamountTowithdraw: React.Dispatch<React.SetStateAction<string | any>>;
  amountTowithdraw: string | any;
  show: string | any;
}

interface PublishedKeyLog {
  x_cor: string;
  y_cor: string;
  sharedSecret: string;
}

interface StealthTransactionItem {
  address: string;
  fullAddress: string;
  balance: string;
  balanceValue: number;
  key: string;
  hasBalance: boolean;
  matchIndex: number;
}

const EMPTY_PUBLISHED_KEY =
  "00000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

function isHexKey(value: string) {
  return /^[0-9a-fA-F]{64}$/.test(value);
}

function normalizeSecretKey(rawValue: string) {
  const trimmed = rawValue.trim();
  const match = trimmed.match(
    /#?forus-(?:secretKey|signatureKey)-([0-9a-fA-F]{64})/i
  );

  if (match?.[1]) {
    return match[1];
  }

  const withoutPrefix = trimmed.startsWith("0x") ? trimmed.slice(2) : trimmed;
  if (isHexKey(withoutPrefix)) {
    return withoutPrefix;
  }

  throw new Error("Invalid Secret File");
}

function isEmptyLog(log: PublishedKeyLog) {
  const keyString = `${log.sharedSecret.replace("0x", "")}04${log.x_cor.slice(
    2
  )}${log.y_cor.slice(2)}`;

  return keyString === EMPTY_PUBLISHED_KEY;
}

function deriveStealthPrivateKey(log: PublishedKeyLog, secretKey: string) {
  const receiverKeyPair = ec.keyFromPrivate(secretKey, "hex");
  const combinedKey = `${log.sharedSecret.replace("0x", "")}04${log.x_cor.slice(
    2
  )}${log.y_cor.slice(2)}`;

  if (combinedKey === EMPTY_PUBLISHED_KEY) {
    return null;
  }

  const publicKey = combinedKey.slice(4);
  const ephemeralKeyPair = ec.keyFromPublic(publicKey, "hex");
  const calculatedSecret = receiverKeyPair.derive(ephemeralKeyPair.getPublic());
  const calculatedSecretBytes = calculatedSecret.toArray();

  if (calculatedSecretBytes.length < 2) {
    return null;
  }

  const calculatedPrefix =
    calculatedSecretBytes[0].toString(16).padStart(2, "0") +
    calculatedSecretBytes[1].toString(16).padStart(2, "0");

  if (calculatedPrefix.toLowerCase() !== combinedKey.slice(0, 4).toLowerCase()) {
    return null;
  }

  const hashedSecret = ec.keyFromPrivate(keccak256(calculatedSecretBytes));
  const stealthPrivateKey = receiverKeyPair
    .getPrivate()
    .add(hashedSecret.getPrivate())
    .mod(ec.curve.n)
    .toString(16, 32);

  const wallet = new ethers.Wallet(stealthPrivateKey);

  return {
    privateKey: stealthPrivateKey,
    fullAddress: wallet.address,
  };
}

export const Receive: React.FC<ChildProps> = ({
  withdrawFunction,
  setmasterkey,
}) => {
  const { ethereum }: any = window;

  const [savedSignaturekey, setsavedSignaturekey] = useState<string>("");
  const [err, seterr] = useState<string>("");
  const [pkCopiedIndex, setPkCopiedIndex] = useState<number | null>(null);
  const [trxList, settrxList] = useState<StealthTransactionItem[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [totalPublishedKeys, setTotalPublishedKeys] = useState<number>(0);
  const [lastScanAt, setLastScanAt] = useState<string>("");
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const scanRunRef = useRef(0);

  const currentNetwork: string | null = sessionStorage.getItem("chain");
  const sessionSignatureKey =
    sessionStorage.getItem("signature") ||
    localStorage.getItem("signature") ||
    "";

  const contractaddress: string | null = useMemo(() => {
    const chainId = ethereum?.chainId || "";
    const selectedById = chainOptions.find(
      (chain) => chain.chainId.toLowerCase() === String(chainId).toLowerCase()
    );
    const selectedByName = chainOptions.find(
      (chain) => currentNetwork === chain.name
    );
    const selectedChain = selectedById || selectedByName;
    return selectedChain ? selectedChain.contract : null;
  }, [currentNetwork, ethereum]);

  const provider = useMemo(() => {
    if (!ethereum) {
      return null;
    }

    return new ethers.providers.Web3Provider(ethereum);
  }, [ethereum]);

  const contract = useMemo(() => {
    if (!contractaddress || !provider) {
      return null;
    }

    return new ethers.Contract(contractaddress, Abi.abi, provider);
  }, [contractaddress, provider]);

  const refreshMetadata = async () => {
    isDetected();

    if (!contract) {
      return 0;
    }

    const totalKeys = await contract.pubKeysLen();
    const parsedTotal = totalKeys.toNumber();
    setTotalPublishedKeys(parsedTotal);
    return parsedTotal;
  };

  const readSignatureFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve((event.target?.result as string) || "");
      };

      reader.onerror = (event) => {
        reject(event.target?.error);
      };

      reader.readAsText(file);
    });
  };

  const scanForTransactions = async (secretKeyInput?: string) => {
    if (!provider || !contract) {
      if (!ethereum) {
        seterr("Wallet provider is not available.");
      }
      return;
    }

    const activeSecretKey = secretKeyInput || savedSignaturekey || sessionSignatureKey;

    if (!activeSecretKey) {
      seterr("Upload your secret file to scan recent transactions.");
      return;
    }

    let normalizedSecretKey = "";

    try {
      normalizedSecretKey = normalizeSecretKey(activeSecretKey);
    } catch (error: any) {
      if (secretKeyInput) {
        seterr(error?.message || "Invalid Secret File");
      } else {
        seterr("Upload your secret file to scan recent transactions.");
        setsavedSignaturekey("");
        sessionStorage.removeItem("signature");
        localStorage.removeItem("signature");
      }
      return;
    }

    const currentRun = scanRunRef.current + 1;
    scanRunRef.current = currentRun;

    setIsScanning(true);
    setPkCopiedIndex(null);
    seterr("");
    setsavedSignaturekey(normalizedSecretKey);
    sessionStorage.setItem("signature", normalizedSecretKey);
    localStorage.setItem("signature", normalizedSecretKey);

    try {
      const totalKeys = await refreshMetadata();

      if (currentRun !== scanRunRef.current) {
        return;
      }

      if (totalKeys <= 0) {
        setMatchedCount(0);
        settrxList([]);
        setLastScanAt(new Date().toLocaleTimeString());
        return;
      }

      const startingPoints = Array.from(
        { length: Math.ceil(totalKeys / PAGE_SIZE) },
        (_, index) => totalKeys - index * PAGE_SIZE
      ).filter((value) => value > 0);

      const pages = await Promise.all(
        startingPoints.map((start) =>
          contract.retrievePubKeys(BigNumber.from(start))
        )
      );

      if (currentRun !== scanRunRef.current) {
        return;
      }

      const publishedLogs = pages
        .flat() as PublishedKeyLog[];

      const uniqueMatches = new Map<
        string,
        {
          privateKey: string;
          fullAddress: string;
          matchIndex: number;
        }
      >();

      publishedLogs.forEach((log, index) => {
        if (!log || isEmptyLog(log)) {
          return;
        }

        try {
          const derived = deriveStealthPrivateKey(log, normalizedSecretKey);

          if (!derived) {
            return;
          }

          if (!uniqueMatches.has(derived.fullAddress)) {
            uniqueMatches.set(derived.fullAddress, {
              privateKey: derived.privateKey,
              fullAddress: derived.fullAddress,
              matchIndex: index,
            });
          }
        } catch (error) {
          console.error("Skipping invalid published key", error);
        }
      });

      const matchedWallets = Array.from(uniqueMatches.values());

      const walletBalances = await Promise.all(
        matchedWallets.map(async (wallet) => {
          const rawBalance = await provider.getBalance(wallet.fullAddress);
          const balanceValue = Number(ethers.utils.formatEther(rawBalance));
          const hasBalance = balanceValue > 0.000001;

          return {
            address:
              wallet.fullAddress.slice(0, 6) +
              "..." +
              wallet.fullAddress.slice(-4),
            fullAddress: wallet.fullAddress,
            balance: balanceValue.toFixed(6),
            balanceValue,
            key: wallet.privateKey,
            hasBalance,
            matchIndex: wallet.matchIndex,
          };
        })
      );

      if (currentRun !== scanRunRef.current) {
        return;
      }

      const sortedWallets = walletBalances
        .filter((item) => item.hasBalance)
        .sort((left, right) => {
        if (left.hasBalance !== right.hasBalance) {
          return Number(right.hasBalance) - Number(left.hasBalance);
        }

        return left.matchIndex - right.matchIndex;
      });

      setMatchedCount(sortedWallets.length);
      settrxList(sortedWallets);
      setLastScanAt(new Date().toLocaleTimeString());
    } catch (error: any) {
      if (currentRun !== scanRunRef.current) {
        return;
      }

      settrxList([]);
      setMatchedCount(0);
      seterr(error?.message || "Unable to scan recent transactions");
    } finally {
      if (currentRun === scanRunRef.current) {
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    refreshMetadata().catch((error) => {
      console.error("Failed to load receive metadata", error);
    });
  }, [contract]);

  useEffect(() => {
    if (!contract || !provider || !sessionSignatureKey) {
      return;
    }

    scanForTransactions(sessionSignatureKey).catch((error) => {
      console.error("Initial transaction scan failed", error);
    });
  }, [contract, provider]);

  const verifySignature = (signatureContents: string) => {
    try {
      const normalizedSecret = normalizeSecretKey(signatureContents);
      setsavedSignaturekey(normalizedSecret);
      sessionStorage.setItem("signature", normalizedSecret);
      localStorage.setItem("signature", normalizedSecret);
      seterr("");
      return normalizedSecret;
    } catch (error: any) {
      seterr(error?.message || "Invalid Secret File");
      return null;
    }
  };

  const copykey = (pkey: string, index: number) => {
    navigator.clipboard.writeText(pkey);

    setPkCopiedIndex(index);
    window.setTimeout(() => {
      setPkCopiedIndex(null);
    }, 2000);

    try {
      withdrawFunction();
    } catch (error) {
      console.error(error);
    }

    setmasterkey(pkey);
  };

  const handleSignatureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const contents = await readSignatureFile(file);
      const normalizedSecret = verifySignature(contents);

      if (!normalizedSecret) {
        settrxList([]);
        setMatchedCount(0);
        return;
      }

      settrxList([]);
      setMatchedCount(0);
      await scanForTransactions(normalizedSecret);
    } catch (error: any) {
      seterr(error?.message || "Unable to read signature file");
    } finally {
      event.target.value = "";
    }
  };

  const fundedTransactions = trxList.filter((transaction) => transaction.hasBalance);

  return (
    <>
      <div className="mx-auto mt-0 flex w-full max-w-3xl flex-col gap-4 text-left">
        <div className="rounded-[26px] border border-slate-700 bg-slate-800/45 p-4 sm:p-5">
          <div className="space-y-6 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
                  Receive the Funds
                </p>
                <div className="mt-1 flex items-center gap-2 text-slate-400">
                  <TbShieldCheck className="text-[1rem] text-cyan-300" />
                  <p className="montserrat-small text-sm">
                    Upload your secret file to scan the newest stealth addresses and reveal any funds sent to you.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 text-right">
                <p className="montserrat-small whitespace-nowrap text-sm font-semibold text-cyan-400">
                  {fundedTransactions.length} funded / {matchedCount} matched
                </p>
                <p className="montserrat-small text-xs text-slate-400">
                  {totalPublishedKeys} published keys on this network
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-800/60 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-200">
                  <MdHistory className="text-[1.15rem] text-cyan-300" />
                  <span className="montserrat-subtitle text-[0.95rem] font-semibold">
                    Recent Transactions
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {lastScanAt && (
                    <span className="montserrat-small text-xs text-slate-400">
                      Last synced at {lastScanAt}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      scanForTransactions().catch((error) => {
                        console.error("Manual refresh failed", error);
                      });
                    }}
                    disabled={isScanning || (!savedSignaturekey && !sessionSignatureKey)}
                    className="flex items-center gap-1 rounded-xl border border-slate-600 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MdOutlineRefresh
                      className={`text-base ${isScanning ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
                {isScanning ? (
                  <h1 className="text-left text-sm montserrat-small text-slate-300">
                    Scanning the latest published keys and checking wallet balances...
                  </h1>
                ) : trxList.length > 0 ? (
                  trxList.map((transaction, index) => (
                    <div
                      key={`${transaction.fullAddress}-${index}`}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900/35 px-4 py-4 text-cyan-400 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col space-y-2">
                        <h2 className="montserrat-small text-left font-semibold text-slate-400">
                          Address
                        </h2>
                        <p className="text-slate-200">{transaction.address}</p>
                        <p className="montserrat-small text-xs text-slate-500">
                          Match #{transaction.matchIndex + 1}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <h2 className="montserrat-small text-left font-semibold text-slate-400">
                          Balance
                        </h2>
                        <div className="flex items-center gap-2 text-slate-200">
                          <img
                            src={eth}
                            alt="ETH"
                            className="h-[18px] w-[18px] rounded-full"
                          />
                          <span>{transaction.balance}</span>
                          <span className="montserrat-small text-xs text-slate-400">
                            ETH
                          </span>
                        </div>
                        <p className="montserrat-small text-xs text-slate-500">
                          {transaction.hasBalance
                            ? "Ready to withdraw"
                            : "No current balance on this stealth address"}
                        </p>
                      </div>

                      <div className="flex flex-col items-start justify-center space-y-2 font-semibold sm:items-end">
                        <h2 className="montserrat-small text-left text-slate-400">
                          Withdraw
                        </h2>

                        {!transaction.hasBalance ? (
                          <span className="montserrat-small text-xs text-slate-500">
                            Unavailable
                          </span>
                        ) : pkCopiedIndex !== index ? (
                          <ToolTip tooltip="Withdraw directly from your stealth address.">
                            <TbTransferIn
                              onClick={() => copykey(transaction.key, index)}
                              className="cursor-pointer text-[1.2rem] font-bold text-cyan-300 hover:text-slate-300"
                            />
                          </ToolTip>
                        ) : (
                          <MdOutlineDone className="text-[1.2rem] font-bold text-cyan-300" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className="text-left text-sm montserrat-small text-slate-400">
                    No matching stealth transactions found yet. Upload your latest secret file and refresh after a new payment lands.
                  </h1>
                )}
              </div>
            </div>

            <label
              className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 px-6 py-[16px] text-center text-[1rem] font-bold text-black transition-all duration-200 montserrat-subtitle ${
                isScanning
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:shadow-[0_14px_40px_rgba(45,212,191,0.25)]"
              }`}
            >
              <AiOutlineUpload className="text-[1.2rem] text-inherit" />
              <span>{isScanning ? "Scanning..." : "Upload Secret File"}</span>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                disabled={isScanning}
                onChange={handleSignatureUpload}
              />
            </label>
          </div>
        </div>

        <p className="montserrat-small min-h-[24px] text-[1rem] font-bold text-red-500">
          {err}
        </p>
      </div>
    </>
  );
};
