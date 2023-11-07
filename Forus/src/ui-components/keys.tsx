import { Crc } from "../helpers/Crc";
import base58 from "bs58";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helpers/downloadTxt";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ToolTip from "../helpers/ToopTip";
import { IoCreateSharp, IoDownloadOutline } from "react-icons/io5";


const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const Keys = (props: Props) => {

  const notyf = new Notyf();

  const [ForusKey, setForusKey] = useState<string | any>("");
  const [, setstoredsignatureKey] = useState<string | any>("");

  //generating the cp address and secret key

  const generateKeys = () => {

    try {

      //generating a elliptic curve keypair

      let key: EC.KeyPair = ec.genKeyPair();

      //calculating privatekey from elliptic key pair

      const privateKey: string = key.getPrivate().toString('hex');

      sessionStorage.setItem("signature", privateKey);




      //calculating public key from elliptic key pair

      const publicKey: any = key.getPublic()

      //converting public key into uint8 array 

      const uint8publicKey = Uint8Array.from(publicKey.encodeCompressed("array")
      );

      //adding 1 byte checkpoint to the public key

      const checkSum = Crc(uint8publicKey);
      const uint8PubKey: Uint8Array = new Uint8Array(uint8publicKey.length + 2);

      uint8PubKey.set(uint8publicKey);
      uint8PubKey.set(checkSum, uint8publicKey.length);

      //adding a single byte prefix "0xfk" to the public key (i.e forus key)

      const _foruskey: string = "Fk" + base58.encode(uint8PubKey);
      sessionStorage.setItem("foruskey", _foruskey);

      setForusKey(_foruskey);


    } catch (e) {
      console.error(e);
    }
  };



  useEffect(() => {

    generateKeys();

  }, []);


  const copyforusKey = () => {

    navigator.clipboard.writeText(ForusKey);
    notyf.success("Copied");
  };



  const downloadKeys = () => {
    navigator.clipboard.writeText(ForusKey);


    let signature = sessionStorage.getItem('signature');
    let forusKey = sessionStorage.getItem('foruskey');
    const content = `#forus-signatureKey-${signature}\nforusKey-${forusKey}`;
    downloadTxt(content, 'forus-keys.txt');
  };



  return (
    <div className="">
      <div className="relative w-full xl:justify-between h-full object-scale-down rounded-md bg-no-repeat 
        flex flex-row items-start gap-6 justify-start py-4 px-6 rounded-t-md z-10  
        bg-gradient-to-tr from-black via-black/80 border-gray-700 border"
      >
        <div className="z-10  pb-6 flex flex-col space-y-1 xl:items-start items-start xl:w-max w-full">
          <h1
            className="montserrat-heading text-transparent  hightlightText  ml-2 font-[1000] sm:text-[1.4rem] xl:text-[1.6rem]
           bg-clip-text  text-xl  bg-gradient-to-r from-highlight to-cyan-600"
          >
            Forus Key
            {/* </span> */}
            <span
              className=" mx-2  sm:text-[1.4rem] xl:text-[1.6rem]
             text-gray-400"
            >
              (Share It to Receive Funds)
            </span>

          </h1>
          <div className="flex space-x-2 pt-2">
            <div className="my-2 flex sm:gap-4 items-center p-2 sm:px-3 sm:mx-0 mx-3 bg-gray-600 rounded-md hover:shadow-sm shadow-gray-400 px-2">
              <p className="sm:text-[.9rem] text-[1.1rem] montserrat-small font-extrabold text-white">
                #Foruskey-{ForusKey}
              </p>
            </div>
            <div className="flex items-center text-white space-x-3">
              <ToolTip tooltip="Copy Forus Key">
                <AiOutlineCopy
                  className="cursor-pointer font-bold text-2xl text-gray-400 hover:text-highlight"
                  onClick={copyforusKey}
                />
              </ToolTip>
            </div>
          </div>
          <div className="text-gray-400  flex justify-around items-center text-[0.7rem] 
          sm:text-[0.8rem] montserrat-small font-semibold">
            <AiOutlineInfoCircle size={20} color="#fff" className="ml-1" />
            <p className="ml-2">
              Never reveal the signature. Only Share your forus key for confidential
              transactions.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-10 mr-6 justify-start z-20">
          <div
            className="flex cursor-pointer space-x-2 my-1 montserrat-subtitle p-1
            montserrat-subtitle px-6 text-center text-gray-300 rounded-md font-semibold
             bg-gray-700 border border-gray-600 min-w-max"
            onClick={generateKeys}
          >
            <IoCreateSharp className="text-[#06B3D2] font-bold text-xl" />
            Generate
          </div>
          <div
            onClick={downloadKeys}
            className="flex cursor-pointer space-x-2 my-1 montserrat-subtitle p-1
             montserrat-subtitle px-6 text-center text-gray-300 rounded-md font-semibold
              bg-gray-800 border border-gray-600 min-w-max"
          >
            <IoDownloadOutline className="text-xl text-inherit" />
            <ToolTip tooltip="Save Signature Key">Store Keys</ToolTip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keys;
