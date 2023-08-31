import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helper/downloadTxt";
import { FaFileSignature } from "react-icons/fa";
import bg from "../assets/bg.png";

const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const ForusKey = (props: Props) => {
  const notyf = new Notyf();
  const [ForusKey, setForusKey] = useState<string | any>("");
  const [, setstoredsignatureKey] = useState<string | any>("");
  const [note, setnote] = useState<boolean>(false);

  //generating the cp address and secret key
  const Generate = () => {
    try {
      let key = ec.genKeyPair();

      const signature: void = sessionStorage.setItem(
        "signature",
        key.getPrivate().toString(16)
      );
      setstoredsignatureKey(signature);

      const signatureKey = ec.keyFromPrivate(
        key.getPrivate().toString(16),
        "hex"
      );

      const publicKey = Uint8Array.from(
        signatureKey.getPublic().encodeCompressed("array")
      );

      const crc = Crc(publicKey);
      const enc: Uint8Array = new Uint8Array(publicKey.length + 2);
      enc.set(publicKey);
      enc.set(crc, publicKey.length);
      const fk: string = "Fk" + base58.encode(enc);
      sessionStorage.setItem("fk", fk);
      setForusKey(fk);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Generate();
  }, []);

  const reveal = () => {
    setnote(true);
    setTimeout(() => {
      setnote(false);
    }, 9000);
  };

  const copy = () => {
    navigator.clipboard.writeText(ForusKey);
    notyf.success("Copied");
  };

  const load = () => {
    navigator.clipboard.writeText(ForusKey);
    downloadTxt(sessionStorage.getItem("signature"), "Forus-signature.txt");
    reveal();
  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="bg-cover object-scale-down border border-black rounded-md backdrop-blur-lg bg-no-repeat flex flex-col items-center p-8 rounded-t-md"
      >
        <div className="pb-6 flex flex-col space-y-4 items-center border-black  w-full">
          <h1
            className="mx-auto montserrat-heading font-[1000]
             sm:text-4xl bg-clip-text text-bgGray
              text-3xl"
          >
            {" "}
            Get your funds privately and securly without revealing any of your
            personal wallet address !!!
          </h1>

          {note === true && (
            <p className="montserrat-small text-bgGray  mb-4 font-semibold font-mono w-[80%]">
              Note : Guard the signature, unleash the Key. Never reveal the
              'signature' , only share your 'ForusKey' for confidential
              transactions.{" "}
            </p>
          )}
        </div>
        {/* Forus */}
        <div className="flex space-x-4">
          <div
            className="my-4 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3 bg-gray-500 bg-opacity-60
           rounded-md hover:shadow-sm shadow-gray-300 px-2   "
          >
            <p
              className="sm:text-[1rem] text-[0.8rem] montserrat-small font-extrabold 
            text-bgGray "
            >
              <span className="sm:text-[1.1rem] text-[0.9rem] text-white text-md font-extrabold">
                #Foruskey
              </span>{" "}
              - {ForusKey}
            </p>
          </div>
          <div className="flex items-center text-white space-x-3">
            <AiOutlineCopy
              className="font-bold text-2xl text-[181b1f] hover:text-[#4e6979] cursor-pointer"
              onClick={copy}
            />
            <FaFileSignature
              className="font-bold text-2xl text-[181b1f] hover:text-[#4e6979] cursor-pointer"
              onClick={load}
            />
          </div>
        </div>

        <button
          className="mb-4 my-2 montserrat-subtitle border-1 p-1 montserrat-subtitle  
         bg-highlight  hover:shadow-xl px-6 text-center  bg-slate-300 text-black 
        rounded-md  font-semibold   hover:scale-105 transition-all ease-linear"
          onClick={Generate}
        >
          Generate
        </button>
      </div>
    </>
  );
};

export default ForusKey;
