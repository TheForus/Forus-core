import { useEffect, useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import { useNavigate } from "react-router-dom";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import {
  AiOutlineArrowsAlt,
  AiOutlineCopy,
  AiOutlineShrink,
} from "react-icons/ai";
import copy from "../Logos/copy.jpg";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { db } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { downloadTxt } from "../helper/downloadTxt";
import { ethers } from "ethers";
import { MdHistory, MdOutlineDone } from "react-icons/md";
import ToolTip from "../helper/ToopTip";

const ec = new EllipticCurve.ec("secp256k1");

//Combining the publickey with signatureKey to calcuate the private key of stealth address

interface ChildProps {
  withdrawFunction: () => void;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
  setamountTowithdraw: React.Dispatch<React.SetStateAction<string | any>>;
}

const Receive: React.FC<ChildProps> = ({
  withdrawFunction,
  setmasterkey,
  setamountTowithdraw,
}) => {
  const notyf = new Notyf();
  var signaturekey: EC.KeyPair | any;
  const { ethereum }: any = window;

  let retrievedArray: any[] = [];

  const [savedSignaturekey, setsavedSignaturekey] = useState<string>("");
  const [, setprivatekey] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const [, setmatchingkey] = useState<boolean>(false);
  const [err, seterr] = useState<any>(false);
  const [id, setId] = useState<string | any>("");
  const [isfounded, setisfounded] = useState<string>("");
  const [pkCopied, setPkCopied] = useState<boolean>(false);

  const keys = collection(db, "Logs");

  const [transactionTab, setTransactionTab] = useState(false);
  const [trxList, settrxList] = useState<any>([]);

  let array: any[] = [];

  const setwallet = async (key: string) => {
    const provider = new ethers.providers.Web3Provider(ethereum);

    let wallet = new ethers.Wallet(key);

    // Get the wallet address
    let add = wallet.address;

    const getbal = await provider.getBalance(add);
    const balance = ethers.utils.formatEther(getbal);
    setamountTowithdraw(balance);

    array.push({
      address: add?.slice(0, 6) + "..." + add?.slice(-4),
      balance: balance,
      key: key,
    });
    console.log("array", array);
    const arrayJson = JSON.stringify(array);
    sessionStorage.setItem("array", arrayJson);

    //getting array

    const retrievedArrayJson: any = sessionStorage.getItem("array");

    // Parse the JSON string back into an array
    retrievedArray = JSON.parse(retrievedArrayJson);

    settrxList(retrievedArray); // storing retreivedArray in RtrxList state

    console.log("retrievedArray", retrievedArray);
  };

  const fetchData = async () => {
    let logs: any[] = [];

    try {
      const data = await getDocs(keys);
      logs = data.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (err: any) {
      console.error(err);
      seterr(err.message);
    }

    //declaring variables type here

    let ephPubKey: EC.KeyPair | any;
    let sharedSecret;
    let hashedSecret;
    let prefix: string | any;

    logs.forEach((z: any) => {
      ephPubKey = ec.keyFromPublic(z.Keys.slice(4), "hex");
      sharedSecret = signaturekey.derive(ephPubKey.getPublic()); //
      hashedSecret = ec.keyFromPrivate(keccak256(sharedSecret.toArray()));

      prefix =
        sharedSecret.toArray()[0].toString(16) +
        sharedSecret.toArray()[1].toString(16);
      // console.log(prefix.toString(), z.Keys.slice(0, 4).toString())
      try {
        if (prefix.toString() === z.Keys.slice(0, 4).toString()) {
          setId(z.id);
          setisfounded("founded");

          const _key = signaturekey.getPrivate().add(hashedSecret.getPrivate());
          const privateKey = _key.mod(ec.curve.n);
          setprivatekey(privateKey.toString(16, 32));

          setwallet(privateKey.toString(16, 32));
        }

        return;
      } catch (e: any) {
        seterr(e.message);
      }
    });
  };

  const generateprivatekey = (): void => {
    const { ethereum }: any = window;
    if (!ethereum) {
      notyf.error("plz initialize metamask");
      return;
    }

    setmatchingkey(true);

    let skey: string | any = sessionStorage.getItem("signature");
    console.log("savedSignature : ", savedSignaturekey);
    if (savedSignaturekey === "") {
      signaturekey = ec.keyFromPrivate(skey, "hex");
    } else {
      signaturekey = ec.keyFromPrivate(savedSignaturekey, "hex");
    }
    console.log("signature key : ", signaturekey);

    fetchData();

    if (isfounded === "founded") {
      notyf.success("Matched");
    }

    setmatchingkey(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removingKey = async () => {
    const Doc = doc(db, "Logs", id);
    await deleteDoc(Doc);
  };

  const copykey = (pkey: string) => {
    navigator.clipboard.writeText(pkey);

    setPkCopied(true);

    try {
      withdrawFunction();
    } catch (e: any) {
      console.error(e);
    }

    downloadTxt("#walletprivateKey-" + pkey, "Forus-privatekey.txt");

    setmasterkey(pkey);

    /// remove the key from firebase database

    removingKey();

    sessionStorage.removeItem("array");
  };

  return (
    <>
      <div className="flex mx-auto justify-center items-center">
        <div className="flex justify-end w-full">


          <div className="py-2 px-2 flex justify-between space-x-1 items-center w-full">
            {trxList && trxList.length > 0 && (
              <h1 className="animate-pulse-2s text-highlight font-semibold text-[0.9rem]">
                <span>{trxList.length}</span> Transaction Found !{" "}
              </h1>
            )}
            <div
              className="flex items-center space-x-1 cursor-pointer hover:text-white
             text-gray-400 border-b border-dashed border-gray-600 text-[1rem] text-left"
              onClick={() => setTransactionTab(!transactionTab)}
            >
              <span>
                <MdHistory className="text-[1.1rem] text-inherit" />
              </span>
              <p>View Transactions </p>
            </div>
          </div>

        </div>
      </div>
      {transactionTab ? (
        trxList && trxList.length > 0 ? (
          trxList.map((z: any, i: any) => (
            <div className="pt-4 flex justify-between px-6 text-highlight bg-gray-0">
              <div className="flex flex-col space-y-2">
                <h2 className="text-left">Address </h2>
                <p className="text-gray-300">{z.address}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-left">Balance </h2>
                <p className="text-gray-300">{z.balance}</p>
              </div>
              <div className="flex flex-col justify-center items-end space-y-2">
                <h2 className="text-left">Private key </h2>
                {!pkCopied ? (
                  <ToolTip tooltip="Copy Private key">
                    <AiOutlineCopy
                      onClick={() => copykey(z.key)}
                      className={`text-gray-300 hover:text-green-400 font-bold cursor-pointer text-[1.2rem]`}
                    />
                  </ToolTip>
                ) : (
                  <MdOutlineDone
                    // onClick={() => copykey(z.key)}
                    className={`text-green-500 font-bold text-[1.2rem] text-highlight`}
                  />
                )}
                {/* <img alt="" src={copy} className="h-6 w-6 cursor-pointer" /> */}
              </div>
            </div>
            // <div key={i} className=" text-white ">
          ))
        ) : (
          <h1 className="text-center relative top-5 text-xl text-gray-500">
            No Transactions Recorded !
          </h1>
        )
      ) : (
        <div>
          <div className="py-2 flex space-x-1 justify-center mx-2">
            {hide !== true && (
              <input
                type="text"
                className="text-[0.9rem] font-semibold text-gray-100 placeholder:text-gray-500
            montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
            hover:border-cyan-900 w-[100%] bg-black/40 border-2 border-gray-500"
                value={savedSignaturekey}
                onChange={(e) => {
                  setsavedSignaturekey(e.target.value);
                }}
                placeholder="Signature (optional)"
              />
            )}
            {hide && (
              <p className="text-gray-400 p-1 py-2 font-semibold montserrat-small ">
                Expand to enter the signatureKey (optional)
              </p>
            )}
            {/* expand icon (toggle of input button) */}
            <div className="flex items-center">
              {hide ? (
                <AiOutlineArrowsAlt
                  className=" cursor-pointer  text-[#a7acb3]"
                  size={25}
                  onClick={() => sethide(!hide)}
                />
              ) : (
                <AiOutlineShrink
                  className="cursor-pointer  text-[#a7acb3]"
                  size={29}
                  onClick={() => sethide(!hide)}
                />
              )}
            </div>
          </div>

          {/* Match key */}
          <div className="cursor-pointer flex justify-center pt-2">
            <div
              className="w-full mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black
          rounded-md font-bold hover:border-highlight hover:text-highlight transition-all ease-linear"
              onClick={generateprivatekey}
            >
              {/* <GiKangaroo size={26} /> */}
              <h2 className="montserrat-small">Scan</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Receive;
