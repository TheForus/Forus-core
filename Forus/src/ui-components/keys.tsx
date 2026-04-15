import { Crc } from "../helpers/Crc";
import base58 from "bs58";
import { useEffect, useState } from "react";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { downloadTxt } from "../helpers/downloadTxt";
import ToolTip from "../helpers/ToopTip";
import { IoCreateSharp, IoDownloadOutline } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";

const ec = new EllipticCurve.ec("secp256k1");
const PAGE_LOAD_SESSION_KEY = "forus-page-load-id";
const CURRENT_PAGE_LOAD_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type Props = {};

const Keys = (props: Props) => {
  const [ForusKey, setForusKey] = useState<string>("");
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState<boolean>(false);
  const [confirmedDownloadRisk, setConfirmedDownloadRisk] =
    useState<boolean>(false);

  const buildForusKeys = () => {
    const key: EC.KeyPair = ec.genKeyPair();
    const privateKey: string = key.getPrivate().toString("hex");
    const publicKey = key.getPublic();
    const uint8publicKey = Uint8Array.from(publicKey.encodeCompressed("array"));
    const checkSum = Crc(uint8publicKey);
    const uint8PubKey: Uint8Array = new Uint8Array(uint8publicKey.length + 2);

    uint8PubKey.set(uint8publicKey);
    uint8PubKey.set(checkSum, uint8publicKey.length);

    const nextForusKey = "Fk" + base58.encode(uint8PubKey);

    sessionStorage.setItem("signature", privateKey);
    sessionStorage.setItem("foruskey", nextForusKey);
    sessionStorage.setItem(PAGE_LOAD_SESSION_KEY, CURRENT_PAGE_LOAD_ID);

    setForusKey(nextForusKey);
  };

  const hydrateOrGenerateKeys = () => {
    try {
      const storedForusKey = sessionStorage.getItem("foruskey");
      const storedSignature = sessionStorage.getItem("signature");
      const storedPageLoadId = sessionStorage.getItem(PAGE_LOAD_SESSION_KEY);

      const isSamePageLoad = storedPageLoadId === CURRENT_PAGE_LOAD_ID;

      if (isSamePageLoad && storedForusKey && storedSignature) {
        setForusKey(storedForusKey);
        return;
      }

      buildForusKeys();
    } catch (error) {
      console.error(error);
    }
  };

  const generateKeys = () => {
    try {
      buildForusKeys();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    hydrateOrGenerateKeys();
  }, []);

  const copyforusKey = () => {
    const shareUrl = `https://theforus.xyz/Forus?key=${ForusKey}`;
    navigator.clipboard.writeText(shareUrl);
    setAddressCopied(true);
    window.setTimeout(() => {
      setAddressCopied(false);
    }, 2000);
  };

  const openDownloadPrompt = () => {
    setConfirmedDownloadRisk(false);
    setShowDownloadPrompt(true);
  };

  const closeDownloadPrompt = () => {
    setShowDownloadPrompt(false);
    setConfirmedDownloadRisk(false);
  };

  const downloadKeys = () => {
    const signature = sessionStorage.getItem("signature");
    const forusKey = sessionStorage.getItem("foruskey");
    const content = `#forus-secretKey-${signature}\nforusKey-${forusKey}`;
    downloadTxt(content, "forus-secret-keys.txt");
    closeDownloadPrompt();
  };

  return (
    <main>
      <div
        className="relative mx-auto flex h-full w-full max-w-3xl flex-col items-start justify-start gap-6 rounded-[26px] border border-slate-700 bg-slate-800/45 bg-no-repeat px-5 py-6 md:px-6 xl:justify-between"
      >
        <div className="z-10 flex w-full flex-col items-start space-y-4 text-left">
          <div className="flex flex-col gap-1">
            <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
              Key Generation
            </p>
            <p className="montserrat-small text-sm text-slate-400">
              Copy and share the link to receive funds. Save the secret keys for withdrawal.
            </p>
          </div>

          <div className="flex w-full min-w-0 flex-col">
            <div className="grid w-full min-w-0 lg:items-center">
              <div
                className="grid min-h-[68px] w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-800/80 px-3 py-3"
              >
                <div className="min-w-0 overflow-hidden">
                  <p
                    title={`#Foruskey-${ForusKey}`}
                    className="montserrat-subtitle block overflow-hidden text-ellipsis whitespace-nowrap text-left text-[0.78rem] font-semibold text-slate-400 sm:text-[0.9rem] md:text-[0.95rem]"
                  >
                    {`#Foruskey-${ForusKey}`}
                  </p>
                </div>

                <ToolTip tooltip="Copy Link">
                  {addressCopied ? (
                    <MdOutlineDone className="inline-flex shrink-0 text-[1.05rem] font-bold text-cyan-300" />
                  ) : (
                    <AiOutlineCopy
                      className="inline-flex shrink-0 cursor-pointer text-[1rem] font-bold text-slate-400"
                      onClick={copyforusKey}
                    />
                  )}
                </ToolTip>

                <div className="flex shrink-0 items-center justify-end text-white">
                  <ToolTip tooltip="Download the secret keys.">
                    <IoDownloadOutline
                      className="inline-flex h-[22px] w-[22px] cursor-pointer text-[1rem] font-bold text-[#06B3D2]"
                      onClick={openDownloadPrompt}
                    />
                  </ToolTip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="montserrat-subtitle flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 px-6 py-[16px] text-center text-[1rem] font-bold text-black transition-all duration-200 hover:shadow-[0_14px_40px_rgba(45,212,191,0.25)]"
          onClick={generateKeys}
        >
          <IoCreateSharp className="text-xl font-bold text-inherit" />
          <span>Generate</span>
        </button>
      </div>

      {showDownloadPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-slate-700 bg-[linear-gradient(180deg,rgba(18,30,47,0.98)_0%,rgba(10,18,30,0.98)_100%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <p className="montserrat-small text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/75">
              Secret Key Warning
            </p>
            <h3 className="montserrat-subheading mt-3 text-2xl font-bold text-slate-100">
              Save keys securely
            </h3>
            <p className="montserrat-small mt-3 text-sm leading-7 text-slate-300">
              Never share secret keys with anyone. This file contains the secret
              key that can give access to your private funds. Store it only in a
              secure and private place.
            </p>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-700 bg-slate-800/55 px-4 py-4 text-left">
              <input
                type="checkbox"
                checked={confirmedDownloadRisk}
                onChange={(event) => setConfirmedDownloadRisk(event.target.checked)}
                className="mt-1 h-4 w-4 accent-cyan-400"
              />
              <span className="montserrat-small text-sm font-semibold text-slate-200">
                I understand that secret keys must never be shared and I will
                store this file safely.
              </span>
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeDownloadPrompt}
                className="montserrat-subtitle flex-1 rounded-2xl border border-slate-600 bg-slate-800/75 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={downloadKeys}
                disabled={!confirmedDownloadRisk}
                className={`montserrat-subtitle flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                  confirmedDownloadRisk
                    ? "bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-black hover:shadow-[0_14px_40px_rgba(45,212,191,0.25)]"
                    : "cursor-not-allowed bg-slate-700 text-slate-400"
                }`}
              >
                Download Keys
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Keys;
