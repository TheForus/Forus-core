import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helper/downloadTxt";
const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const Cr = (props: Props) => {
  const notyf = new Notyf();
  const [cryptiaaddress, setcryptiaaddress] = useState<string | any>("");
  const [, setstoredsecretkey] = useState<string | any>("");
  const [note, setnote] = useState<boolean>(false);

  const Generate = () => {
    try {
      let key = ec.genKeyPair();

      const skey: void = sessionStorage.setItem(
        "secretKey",
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
      const cp: string = "cp" + base58.encode(enc);
      sessionStorage.setItem("Cr", cp);
      setcryptiaaddress(cp);
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
    navigator.clipboard.writeText(cryptiaaddress);
    downloadTxt(sessionStorage.getItem("secretKey"), "cryptia-secretKey.txt");
    reveal();
    notyf.success("Copied");
  };

  return (
    <>
      <div className="flex flex-col items-center p-6 rounded-t-md">
        <div className="pb-6 flex flex-col space-y-4 items-center border-b w-full">
          <h1
            className="mx-auto montserrat-subtitle font-extrabold
             sm:text-5xl  text-[#181b1f] 
              text-3xl"
          >
            {" "}
            Unleash the potential of confidentiality with the vpn of blockchain
          </h1>

          {note === true && (
            <p className="montserrat-small text-[#181b1f] font-semibold font-mono w-[80%]">
              Guard the key, unleash the cp. Never reveal the 'secret key' ,
              only share your secure 'Cp address' for confidential transactions.{" "}
            </p>
          )}
        </div>
        {/* cryptia */}
        <div className="my-6 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3  rounded-md  shadow-md shadow-gray-300 hover:shadow-lg px-2   ">
          <p className="sm:text-[1rem] text-[0.8rem] montserrat-small font-semibold text-gray-800">
            <span className="sm:text-[1.1rem] text-[0.9rem] text-gray-900 text-md font-extrabold">
              #Cryptia
            </span>{" "}
            - {cryptiaaddress}
          </p>
          <AiOutlineCopy
            className="font-bold text-2xl text-[#181b1f] hover:text-[#4e6979] cursor-pointer"
            onClick={copy}
          />
        </div>

        <button
          className="mb-4 montserrat-subtitle border-1 p-1 montserrat-subtitle  
         bg-[#181b1f]  hover:shadow-xl px-6 text-center 
        rounded-md  font-semibold   
        text-[#dbe6eb]  border-[#181b1f] border"
          onClick={Generate}
        >
          Generate
        </button>
      </div>
    </>
  );
};

export default Cr;
