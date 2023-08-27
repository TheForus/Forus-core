import { useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { BsDownload } from "react-icons/bs";
import copy from "../Logos/copy.jpg";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { db } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { downloadTxt } from "../helper/downloadTxt";
const ec = new EllipticCurve.ec("secp256k1");

//Combining the publickey with signatureKey to calcuate the private key of stealth address

const Withdraw = () => {
  return (
    <>
      <h2 className="text-bgGray text-[1.3rem] text-left mb-3">
        Recipient Address
      </h2>
      <div className="py-2 flex space-x-4 justify-center ml-1">
        <input
          type="text"
          className="text-[0.9rem] font-semibold text-gray-100 placeholder:text-gray-500
          montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
           hover:border-gray-400 w-[100%] bg-black/40 border-2 border-gray-500"
          // className=" text-[0.9rem] tect font-semibold text-gray-700 placeholder:text-gray-700
          //   montserrat-subtitle outline-none px-3 py-3 h-[100%] hover:shadow-sm rounded-md hover:shadow-gray-400 w-[100%] bg-bgGray"
          // value={savedSignaturekey}
          // onChange={(e) => {
          //   setsavedSignaturekey(e.target.value);
          // }}
          placeholder="Enter Recipient Address"
        />
        {/* Download Icon */}
        <div className="flex items-center">
          <BsDownload
            className=" cursor-pointer  text-[#bbc1c9]"
            size={28}
            // onClick={() => sethide(!hide)}
          />
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="w-full flex justify-center pt-2 mr-4">
        <button
          className="w-[97%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          bg-highlight  hover:shadow-xl px-6 text-center bg-gray-300 text-black 
          rounded-md font-bold hover:bg-gray-100 transition-all ease-linear "
          // onClick={generateprivatekey}
        >
          {/* <GiKangaroo size={26} /> */}
          Withdraw
        </button>
      </div>

      {/* message */}
    </>
  );
};

export default Withdraw;
