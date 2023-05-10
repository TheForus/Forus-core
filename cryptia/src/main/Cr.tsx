import { Crc } from "../helper/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
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

      const skey: void = localStorage.setItem(
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
      const C: string = "C" + base58.encode(enc);
      localStorage.setItem("Cr", C);
      setcryptiaaddress(C);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Generate();
  }, []);

  const downloadTxt = (text: any) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cryptia-secretKey.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reveal = () => {
    setnote(true);
    setTimeout(() => {
      setnote(false);
    }, 9000);
  };

  const copy = () => {
    navigator.clipboard.writeText(cryptiaaddress);
    downloadTxt(localStorage.getItem("secretKey"));
    reveal();
    notyf.success("Copied");
  };

  return (
    <>
      <div className="flex flex-col items-center p-8 rounded-t-md">
        <div className="pb-6 flex flex-col space-y-4 items-center border-b w-full">
          <h1
            className="mx-auto sm:w-[70%] montserrat-subtitle dark:text-gray-100 text-[#6c8492]  md:text-3xl 
        text-4xl  font-bold"
          >
            {" "}
            Unlock the
            <span
              className="montserrat-subtitle md:text-3xl 
        text-4xl font-extrabold"
            >
              {" "}
              power of secrecy
            </span>{" "}
            with Cryptia Protocol
          </h1>

          {note === true && (
            <p className="montserrat-small text-[#6c8492] font-semibold font-mono w-[80%]">
              Guard the key, unleash the cr. Never reveal the 'secret key' ,
              only share your secure 'Cr address' for confidential transactions.{" "}
            </p>
          )}
        </div>
        {/* cryptia */}
        <div className="my-6 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3  rounded-md  bg-[#d1f5e5]">
          <p className="sm:text-[1rem] text-[0.7rem] montserrat-small font-semibold dark:text-gray-900 text-[#435864]">
            <span className="sm:text-[1rem] text-[0.8rem] text-gray-900 dark:text-black text-md font-bold">
              #Cryptia
            </span>{" "}
            - #{cryptiaaddress}
          </p>
          <AiOutlineCopy
            className="font-bold text-2xl text-[#6c8492] hover:text-[#4e6979] cursor-pointer"
            onClick={copy}
          />
        </div>

        <button
          className="mb-4 montserrat-subtitle border-1 p-1 montserrat-subtitle  
        text-[#E8FDF4] dark:text-[#06324e] dark:hover:text-gray-300 bg-[#10F1B4]  hover:shadow-xl px-6 text-center 
        rounded-md  font-semibold   hover:bg-gray-800 dark:border-gray-700 
        hover:text-[#10F1B4]  hover:border-white dark:border-bgGreen dark:hover:bg-gray-800 border-gray-200 border"
          onClick={Generate}
        >
          Generate
        </button>
      </div>
    </>
  );
};

export default Cr;
