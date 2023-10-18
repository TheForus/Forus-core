import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helper/downloadTxt";
import { RxDownload } from "react-icons/rx";
import bg from "../assets/bg.png";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ToolTip from "../helper/ToopTip";
import { IoCreateSharp, IoDownloadOutline } from "react-icons/io5";


const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const ForusKey = (props: Props) => {
  const notyf = new Notyf();
  const [ForusKey, setForusKey] = useState<string | any>("");
  const [, setstoredsignatureKey] = useState<string | any>("");

  //generating the cp address and secret key
  const Generate = () => {
    try {
      //generating a random number
      let key = ec.genKeyPair();

      //conveting that random number in "32 bytes hex private key" (ie : signature key)
      const signature: void = sessionStorage.setItem(
        "signature",
        key.getPrivate().toString(16)
      );
      setstoredsignatureKey(signature);


      //here we making public key (i.e forus key) from our private key (i.e signature key)
      const signatureKey = ec.keyFromPrivate(
        key.getPrivate().toString(16),
        "hex"
      );

      const publicKey = Uint8Array.from(
        signatureKey.getPublic().encodeCompressed("array")
      );

      //adding 1 bytes suffix to the public key (i.e forus key)
      const crc = Crc(publicKey);
      const enc: Uint8Array = new Uint8Array(publicKey.length + 2);
      enc.set(publicKey);
      enc.set(crc, publicKey.length);

      //adding a single byte prefix "fk" to the public key (i.e forus key)
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

  const copyForusKey = () => {
    navigator.clipboard.writeText(ForusKey);
    notyf.success("Copied");
  };

  const saveSignature = () => {
    navigator.clipboard.writeText(ForusKey);
    downloadTxt(
      "#ForusSignature-" +
      sessionStorage.getItem("signature") +
      "\n" +
      "#ForusKey-" +
      ForusKey,
      "Forus-signature.txt"
    );
  };

  return (
    <div className="">
      <div
        // style={{ backgroundImage: `url(${})` }}
        className="relative w-full xl:justify-between h-full object-scale-down rounded-md bg-no-repeat 
        flex flex-row items-start gap-6 justify-start py-4 px-6 rounded-t-md z-10  
        bg-gradient-to-tr from-black via-black/80 border-gray-700 border"
      >
        <div className="z-10  pb-6 flex flex-col space-y-1 xl:items-start items-start xl:w-max w-full">
          <h1
            className="montserrat-heading text-transparent  hightlightText  ml-2 font-[1000] sm:text-[1.4rem] xl:text-[1.6rem]
           bg-clip-text  text-xl  bg-gradient-to-r from-highlight to-cyan-600"
          >
            {/* Share the */}
            {/* <span
              className="hightlightText mx-2 text-transparent sm:text-[1.5rem] xl:text-[1.7rem]
             bg-clip-text bg-gradient-to-r from-highlight to-cyan-600"
            > */}
              Generate forus key & share it.
            {/* </span> */}
            {/* & get paid privately ! */}
          </h1>
          {/* Forus */}
          <div className="flex space-x-2 pt-2">
            <div className="my-2 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3 bg-gray-600 rounded-md hover:shadow-sm shadow-gray-400 px-2">
              <p className="sm:text-[0.9rem] text-[0.8rem] montserrat-small font-extrabold text-white">
                #Foruskey-{ForusKey}
              </p>
            </div>
            <div className="flex items-center text-white space-x-3">
              <ToolTip tooltip="Copy Forus Key">
                <AiOutlineCopy
                  className="cursor-pointer font-bold text-2xl text-gray-400 hover:text-highlight"
                  onClick={copyForusKey}
                />
              </ToolTip>
            </div>
          </div>
          <div className="text-gray-400  flex justify-around items-center text-[0.7rem] 
          sm:text-[0.8rem] montserrat-small font-semibold">
            <AiOutlineInfoCircle size={20} color="#fff" className="ml-1" />
            <p className="ml-2">
            Never reveal the signature. Only Share your forus key to receive
            funds.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-10 mr-6 justify-start z-20">
          <div
            className="flex cursor-pointer space-x-2 my-1 montserrat-subtitle p-1
            montserrat-subtitle px-6 text-center text-gray-300 rounded-md font-semibold
             bg-gray-700 border border-gray-600 min-w-max"
            onClick={Generate}
          >
            <IoCreateSharp className="text-[#06B3D2] font-bold text-xl" />
            Generate
          </div>
          <div
            onClick={saveSignature}
            className="flex cursor-pointer space-x-2 my-1 montserrat-subtitle p-1
             montserrat-subtitle px-6 text-center text-gray-300 rounded-md font-semibold
              bg-gray-700 border border-gray-600 min-w-max"
          >
            <IoDownloadOutline className="font-bold text-[#06B3D2] text-xl text-inherit" />
            <ToolTip tooltip="Save Signature Key">Save Keys</ToolTip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForusKey;
