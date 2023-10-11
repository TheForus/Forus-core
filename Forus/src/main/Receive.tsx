import { useEffect, useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import { generatePath, useNavigate } from "react-router-dom";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import {
  AiOutlineArrowsAlt,
  AiOutlineCopy,
  AiOutlineScan,
  AiOutlineShrink,
} from "react-icons/ai";
// import copy from "../Logos/copy.jpg";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { db } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { downloadTxt } from "../helper/downloadTxt";
import { ethers, BigNumber } from "ethers";
import { MdHistory, MdOutlineDone } from "react-icons/md";
import ToolTip from "../helper/ToopTip";

const ec = new EllipticCurve.ec("secp256k1");

//Combining the publickey with signatureKey to calcuate the private key of stealth address

interface ChildProps {

  withdrawFunction: () => void;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
  setamountTowithdraw: React.Dispatch<React.SetStateAction<string | any>>;
  amountTowithdraw: string | any;
  show: string | any

}

const Receive: React.FC<ChildProps> = ({
  withdrawFunction,
  setmasterkey,
  setamountTowithdraw,
  // show,
  amountTowithdraw,

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
  const [trx2List, settrx2List] = useState<any>([]);

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


    // Convert the array to a Set to remove duplicates
    const uniqueSet = new Set(array);

    // Convert the Set back to an array if needed
    const uniqueArray = Array.from(uniqueSet);

    // Store the unique array in sessionStorage
    sessionStorage.setItem("array", JSON.stringify(uniqueArray));


    //getting array

    const retrievedArrayJson: any = sessionStorage.getItem("array");

    // Parse the JSON string back into an array
    retrievedArray = JSON.parse(retrievedArrayJson);


    //Array.from(new Set(array))
    settrxList(retrievedArray); // storing retreivedArray in RtrxList state

    console.log("retrievedArray", retrievedArray);


  };


  const [index, setIndex] = useState<number>(0)
  const [totalLength, setTotalLength] = useState<number>(0)

  //verify signature

  const verifySignature = ((sign: any) => {
    if (sign.startsWith('#ForusSignature-')) {

      setsavedSignaturekey(sign.replace('#ForusSignature-', '').slice(0, 64));

    }
    else {
      seterr('Invalid Signature File')
    }
  })

  console.log('Saved signature key', savedSignaturekey)

  const fetch = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract('0x9c08ecf2B23C8d18dF2ec7e38c09e0C04649D7f4', Abi.abi, provider);

      const response = await contract.getEphKeys(BigNumber.from(index));
      setTotalLength(await contract.ephKeysLength())
      settrx2List(response)
      console.log('response', response);



      // Increment index by 10 but not greater than totalLength

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {

    // Fetch data initially and then every 750 ms
    fetch();

  }, []);


  useEffect(() => {

    if (totalLength > index) {
      setTimeout(() => {

        setIndex(Math.min(totalLength, index + 10));


      }, 750);

      fetch()

    }


  }, [totalLength]);

  console.log('trxlist', trx2List)


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

    logs.forEach((l: any) => {
      ephPubKey = ec.keyFromPublic(l.Keys.slice(4), "hex");
      sharedSecret = signaturekey.derive(ephPubKey.getPublic()); //
      hashedSecret = ec.keyFromPrivate(keccak256(sharedSecret.toArray()));

      prefix = sharedSecret.toArray()[0].toString(16) + sharedSecret.toArray()[1].toString(16);


      try {
        if (prefix.toString() === l.Keys.slice(0, 4).toString()) {

          setId(l.id);

          setisfounded("founded");

          const _key = signaturekey.getPrivate().add(hashedSecret.getPrivate());
          const privateKey = _key.mod(ec.curve.n);

          setwallet(privateKey.toString(16, 32));
          setsavedSignaturekey('')
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


    fetchData();

    if (isfounded === "founded") {
      notyf.success("Matched");
    }

    setmatchingkey(false);
  };

  useEffect(() => {
    
    if (amountTowithdraw > 0) {
      generateprivatekey();
    }

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

    removingKey();

    sessionStorage.removeItem("array");
  };

  return (
    <>
      <div className="flex mx-auto pt-4 justify-center items-center">
        <div className="flex justify-end w-full">
          <div className="py-2 flex justify-between space-x-1 items-center w-full">
            {trxList && trxList.length > 0 && (
              <h1 className="animate-pulse-2s montserrat-small font-semibold  text-highlight  text-[1rem]">
                <span>{trxList.length}</span> Transaction Found !{" "}
              </h1>
            )}
            <div
              className="flex items-center space-x-1 cursor-pointer 
             text-gray-500 border-b border-dashed border-gray-400 text-[1rem] text-left"
              onClick={() => setTransactionTab(!transactionTab)}
            >
              <span>
                <MdHistory className="text-[1.2rem] text-inherit" />
              </span>
              <p className="montserrat-small font-semibold  " >View Transactions </p>
            </div>
          </div>
        </div>
      </div>
      {transactionTab ? (
        trxList && trxList.length > 0 ? (
          trxList.map((z: any, i: any) => (
            <div className="pt-4 flex justify-between px-6 text-highlight bg-gray-0">
              <div className="flex flex-col space-y-2">
                <h2 className="text-left montserrat-small font-semibold">Address </h2>
                <p className="text-gray-600">{z.address}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-left montserrat-small font-semibold">Balance </h2>
                <p className="text-gray-600">{z.balance}</p>
              </div>
              <div className="flex flex-col montserrat-small font-semibold justify-center items-end space-y-2">
                <h2 className="text-left">Private key </h2>
                {!pkCopied ? (
                  <ToolTip tooltip="Copy Private key">
                    <AiOutlineCopy
                      onClick={() => copykey(z.key)}
                      className={`text-gray-600 hover:text-green-400 font-bold cursor-pointer text-[1.2rem]`}
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
          <h1 className="text-center relative top-5 text-xl montserrat-small font-semibold  text-gray-500">
            No Transactions Recorded !
          </h1>
        )
      ) : (
        <div>
          <div className="py-2 flex space-x-1 justify-between">
            {hide !== true && (
              <input
                type="text"
                className="text-[0.9rem] font-semibold text-gray-400  placeholder:text-gray-500
            montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
            hover:border-cyan-900 w-[100%] bg-[#dedee9] border-2 border-gray-500"
                value={savedSignaturekey}
                onChange={(e) => {
                  setsavedSignaturekey(e.target.value);
                  verifySignature(e.target.value);
                }}
                placeholder="Paste your signature file..."
              />
            )}
            {hide && (
              <p className="text-gray-600 p-1 py-2 font-semibold montserrat-small ">
                Expand to enter the signature Key
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

          <div className="w-full flex justify-center pt-2 mr-4">
            <button
              onClick={generateprivatekey}
              className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black 
          rounded-md font-bold  transition-all ease-linear"
            >
              <AiOutlineScan className="text-[1.3rem] text-inherit" />
              <span>Scan</span>
            </button>
          </div>

          <p className={`text-[1rem] font-bold montserrat-small text-red-500`}>
            {err}
          </p>
        </div>
      )}
    </>
  );
};

export default Receive;
