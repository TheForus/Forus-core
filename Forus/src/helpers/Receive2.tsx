import { useEffect, useMemo, useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
// import { generatePath, useNavigate } from "react-router-dom";
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
import { downloadTxt } from "../helpers/downloadTxt";
import { ethers, BigNumber } from "ethers";
import { MdHistory, MdOutlineDone } from "react-icons/md";
import ToolTip from "../helpers/ToopTip";
import { isDetected } from "../checkers/isDetected";

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
  show,
  amountTowithdraw,

}) => {

  const notyf = new Notyf();
  var signaturekey: EC.KeyPair | any;
  const { ethereum }: any = window;

  let retrievedArray: any[] = [];

  const [savedSignaturekey, setsavedSignaturekey] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const [, setmatchingkey] = useState<boolean>(false);
  const [err, seterr] = useState<any>(false);
  const [pkCopied, setPkCopied] = useState<boolean>(false);



  const [transactionTab, setTransactionTab] = useState(false);
  const [trxList, settrxList] = useState<any>([]);


  let array: any[] = [];


  let provider = useMemo(() => {

    return new ethers.providers.Web3Provider(ethereum);

  }, [])

  const setwallet = async (key: string) => {

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




  //verify signature

  const verifySignature = ((sign: any) => {
    if (sign.startsWith('#forus-signatureKey-')) {

      setsavedSignaturekey(sign.replace('#forus-signatureKey-', '').slice(0, 64));

    }
    else {
      seterr('Invalid Signature File')
    }
  })

  // console.log('Saved signature key', savedSignaturekey)











  const [txList, setTxList] = useState([]);
  const [initValue, setInitValue] = useState(0);

  const fetch = async () => {
    try {

      const contract = new ethers.Contract('0x48b96fF6D5027f6b8bDc9D2FcC13559bf63829Fc', Abi.abi, provider);
      const tvl = await contract.pubKeysLen();
      setInitValue(tvl.toNumber());
      console.log(tvl.toNumber()) // Set initial value to the result of pubKeysLen()
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetch2 = async () => {
    try {

      const contract = new ethers.Contract('0x48b96fF6D5027f6b8bDc9D2FcC13559bf63829Fc', Abi.abi, provider);

      console.log(await contract.logs(BigNumber.from(16)));
      setTxList(await contract.retrievePubKeys(BigNumber.from(initValue)));

      let skey: string | any = sessionStorage.getItem("signature");

      signaturekey = ec.keyFromPrivate(skey, "hex");
      // console.log('signatureKey', signaturekey)
      txList.forEach((l: any) => {

        //x = H(a * R) + b


        const pubkey = `04${l.x_cor.replace("0x", "") + l.y_cor.replace("0x", "")}`
        console.log( pubkey)
        let publickeyPair = ec.keyFromPublic(pubkey, "hex");

        let calculateSecret = signaturekey.derive(publickeyPair.getPublic()); //
        // console.log('calculateSecret', calculateSecret)
        let hashedSecret = ec.keyFromPrivate(keccak256(calculateSecret.toArray())); //

        let _sharedSecret = calculateSecret.toArray()[0].toString(16) + calculateSecret.toArray()[1].toString(16);
        console.log(_sharedSecret.toString(), l.sharedSecret.slice(2).toString())
        console.log(txList)

      })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    const fetch3 = async () => {

      let skey: string | any = sessionStorage.getItem("signature");

      signaturekey = ec.keyFromPrivate(skey, "hex");
      // console.log('signatureKey', signaturekey)
      txList.forEach((l: any) => {

        //x = H(a * R) + b


        const pubkey = `04${l.x_cor.replace("0x", "") + l.y_cor.replace("0x", "")}`
        // console.log(l.sharedSecret.toString(), pubkey)
        let publickeyPair = ec.keyFromPublic(pubkey, "hex");

        let calculateSecret = signaturekey.derive(publickeyPair.getPublic()); //
        // console.log('calculateSecret', calculateSecret)
        let hashedSecret = ec.keyFromPrivate(keccak256(calculateSecret.toArray())); //

        let _sharedSecret = calculateSecret.toArray()[0].toString(16) + calculateSecret.toArray()[1].toString(16);
        console.log(_sharedSecret.toString(), l.sharedSecret.slice(2).toString())


        try {
          if (_sharedSecret.toString() === l.sharedSecret.slice(2).toString()) {
            console.log('hey')


            // const _key = signaturekey.getPrivate().add(hashedSecret.getPrivate());

            // //P = (H(a * R) + b) * G
            // //P = H(Ar)G + B
            // const privateKey = _key.mod(ec.curve.n);

            // setwallet(privateKey.toString(16, 32));
            // setsavedSignaturekey('')
          }

          return;

        } catch (e: any) {
          seterr(e.message);
        }

      })
    }
    useEffect(() => {
      fetch();
    }, []);


    useEffect(() => {
      if (initValue > 0) {
        const timer = setTimeout(() => {
          if (initValue >= 10) {
            setInitValue(initValue - 10); // Update initValue using state
          } else {
            setInitValue(0); // Ensure initValue doesn't go below zero
          }
        }, 750);


        return () => clearTimeout(timer); // Cleanup the timer

      } else {
        setInitValue(0);
        console.log('else', initValue);
      }
    }, [initValue]); // Trigger when initValue changes



    useEffect(() => {
      if (initValue >= 0) {
        fetch2();

        // fetch3() // Fetch data when initValue changes
      }
    }, [initValue]); // Trigger when initValue changes

    // console.log('txList', txList);




    const generateprivatekey = (): void => {

      isDetected()
      setmatchingkey(true);

      fetch2()

      let skey: string | any = sessionStorage.getItem("signature");
      console.log("savedSignature : ", savedSignaturekey);

      if (savedSignaturekey === "") {
        signaturekey = ec.keyFromPrivate(skey, "hex");
      } else {
        signaturekey = ec.keyFromPrivate(savedSignaturekey, "hex");
      }


      setmatchingkey(false);
    };

    useEffect(() => {

      if (amountTowithdraw > 0) {
        generateprivatekey();
      }

    }, []);





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
             text-gray-400 border-b border-dashed border-gray-400 text-[1rem] text-left"
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
            <h1 className="text-center relative top-5 text-xl montserrat-small font-semibold  text-gray-400">
              No Transactions Recorded !
            </h1>
          )
        ) : (
          <div>
            <div className="py-2 flex space-x-1 justify-between">
              {hide !== true && (
                <input
                  type="text"
                  className="text-[0.9rem] font-semibold text-gray-300  placeholder:text-gray-500
            montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
            hover:border-cyan-900 w-[100%] bg-black/10 border-2 border-gray-600"
                  value={savedSignaturekey}
                  onChange={(e) => {
                    setsavedSignaturekey(e.target.value);
                    verifySignature(e.target.value);
                  }}
                  placeholder="Paste your signature file..."
                />
              )}
              {hide && (
                <p className="text-gray-400 p-1 py-2 font-semibold montserrat-small ">
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
                className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle  py-2 
          hover:shadow-xl px-6 text-center text-black highlight 
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
