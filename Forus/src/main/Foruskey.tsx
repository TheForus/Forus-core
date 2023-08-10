import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helper/downloadTxt";
import {FaFileSignature } from "react-icons/fa";
const ec = new EllipticCurve.ec("secp256k1");



type Props = {};

const ForusKey = (props: Props) => {
  const notyf = new Notyf();
  const [ForusKey, setForusKey] = useState<string | any>("");
  const [, setstoredsecretkey] = useState<string | any>("");
  const [note, setnote] = useState<boolean>(false);

  //generating the cp address and secret key
  const Generate = () => {
    try {
      let key = ec.genKeyPair();

      const skey: void = sessionStorage.setItem(
        "signature",
        key.getPrivate().toString(16)
      );
      const secretKey = ec.keyFromPrivate(key.getPrivate().toString(16), "hex");
      setstoredsecretkey(skey);

      const pub = Uint8Array.from(
        secretKey.getPublic().encodeCompressed("array")
      );

      const crc = Crc(pub);
      const enc: Uint8Array = new Uint8Array(pub.length + 2);
      enc.set(pub);
      enc.set(crc, pub.length);
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
  };

  const load = () => {
    navigator.clipboard.writeText(ForusKey);
    downloadTxt(sessionStorage.getItem("signature"), "Forus-signature.txt");
    reveal();
    notyf.success("Copied");
  };


  return (
    <>
      <div className="flex flex-col items-center p-8 rounded-t-md">
        <div className="pb-6 flex flex-col space-y-4 items-center border-b w-full">
          <h1
            className="mx-auto montserrat-subtitle font-extrabold
             sm:text-4xl  text-[#cdd4dc] 
              text-3xl"
          >
            {" "}
            Get your funds privately without revealing any personal wallet address !!!
          </h1>

          {note === true && (
            <p className="montserrat-small text-[#cdd4dc] font-semibold font-mono w-[80%]">
              Guard the signature, unleash the Key. Never reveal the 'signature' ,
              only share your 'ForusKey' for confidential transactions.{" "}
            </p>
          )}
        </div>
        {/* Forus */}
        <div className="my-4 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3 bg-[#cdd4dc]  rounded-md  shadow-md shadow-gray-300 hover:shadow-lg px-2   ">
          <p className="sm:text-[1rem] text-[0.8rem] montserrat-small font-semibold text-gray-900">
            <span className="sm:text-[1.1rem] text-[0.9rem] text-gray-900 text-md font-extrabold">
              #Foruskey
            </span>{" "}
            - {ForusKey}
          </p>
          <AiOutlineCopy
            className="font-bold text-2xl text-[#181b1f] hover:text-[#4e6979] cursor-pointer"
            onClick={copy}
          />

          <FaFileSignature className="font-bold text-2xl text-[#181b1f] hover:text-[#4e6979] cursor-pointer" onClick={load} />
        </div>

        <button
          className="mb-4 my-2 montserrat-subtitle border-1 p-1 montserrat-subtitle  
         bg-[#1f2429]  hover:shadow-xl px-6 text-center 
        rounded-md  font-semibold   
        text-[#cdd4dc]  border-[#1f2429] border"
          onClick={Generate}
        >
          Generate
        </button>
      </div>
    </>
  );
};

export default ForusKey;
