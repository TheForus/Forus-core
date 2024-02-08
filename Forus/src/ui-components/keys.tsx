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
import { MdOutlineDone } from "react-icons/md";




const ec = new EllipticCurve.ec("secp256k1");

type Props = {};

const Keys = (props: Props) => {



  const notyf = new Notyf();

  const [ForusKey, setForusKey] = useState<string | any>("");
  const [addressCopied, setAddressCopied] = useState<boolean>(false);


  //generating keys

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

      //adding a single byte prefix "fk" to the public key (i.e forus key)

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

    navigator.clipboard.writeText(`https://forus.live/forus?key=${ForusKey}`);
    notyf.success("Copied");
    setAddressCopied(true);
  

  };



  const downloadKeys = () => {
    let signature =  sessionStorage.getItem('signature');
    let forusKey  =  sessionStorage.getItem('foruskey');
    const content = `#forus-signatureKey-${signature}\nforusKey-${forusKey}`;
    downloadTxt(content, 'forus-keys.txt');
  };



  return (
    <main className="shadow-2xl shadow-[#1f2a3af3]">
      <div className="relative w-full xl:justify-between h-full rounded-md bg-no-repeat 
        flex flex-col lg:flex-row items-start gap-3 lg:gap-6 justify-start py-4 px-3 md:px-6 rounded-t-md z-10
        bg-gradient-to-tr from-black via-black/80 border-gray-700 border"
      >
        <div className="z-10  pb-6 flex flex-col space-y-1 xl:items-start items-start xl:w-max w-full">
          <h1
            className="montserrat-heading text-transparent  hightlightText  ml-2 font-[1000] sm:text-[1.4rem] xl:text-[1.6rem]
           bg-clip-text  text-xl  bg-gradient-to-r from-highlight to-cyan-600"
          >
            Forus Key
            <span
              className=" mx-2  sm:text-[1.4rem] xl:text-[1.6rem]
             text-gray-400"
            >
              (Share It to Receive Funds)
            </span>

          </h1>
          {/* Forus */}
          <div className="flex space-x-2 pt-2">
            <div className="my-2 flex sm:gap-4 items-center p-2 sm:px-3
             sm:mx-0 mx-3 bg-gray-600 rounded-md hover:shadow-sm shadow-gray-400 px-2">
              <p className="sm:text-[.9rem] text-[0.8rem] md:text-[1.1rem] montserrat-small
               font-extrabold text-white">
                #Foruskey-{ForusKey}
              </p>
            </div>
            <div className="flex items-center text-white md:space-x-3">
              <ToolTip tooltip="Copy Link">
                   {addressCopied ? (
              <MdOutlineDone
                className={` text-white font-bold text-[1.1rem] "text-white `}
              />
            ) : (
              <AiOutlineCopy
                className={`" cursor-pointer flex-bold inline-flex mt-2" : "hidden"
                        } text-white font-bold text-[1.2rem] "text-white `}
                  onClick={copyforusKey}
                      
              />
            )}
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
        <div className="flex lg:flex-col gap-2 lg:mt-10 mr-6 justify-start z-20">
          <div
            className="flex cursor-pointer space-x-2 my-1 montserrat-subtitle p-1
            montserrat-subtitle px-6 text-center text-gray-300 rounded-md font-semibold
             bg-gray-700 border hover:bg-black hover:border-highlight border-[#152F59] min-w-max"
            onClick={generateKeys}
          >
            <IoCreateSharp className="text-[#06B3D2] font-bold text-xl" />
            <ToolTip tooltip="Generate Fresh Forus Key">Generate</ToolTip>
          </div>
          <div
            onClick={downloadKeys}
            className="flex cursor-pointer space-x-2 my-1 montserrat-subtitle p-1
             montserrat-subtitle px-6 text-center text-gray-300 rounded-md font-semibold
              bg-gray-700 hover:bg-black hover:border-highlight border border-gray-600 min-w-max"
          >
            <IoDownloadOutline className="font-bold text-[#06B3D2] text-xl" />
            <ToolTip tooltip="Save Signature Key">Save Keys</ToolTip>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Keys;
