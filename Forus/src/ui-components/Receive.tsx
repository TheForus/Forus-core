import { useEffect, useMemo, useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import {
  AiOutlineArrowsAlt,
  AiOutlineCopy,
  AiOutlineScan,
  AiOutlineShrink,
} from "react-icons/ai";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { downloadTxt } from "../helpers/downloadTxt";
import { ethers, BigNumber } from "ethers";
import { MdHistory, MdOutlineDone } from "react-icons/md";
import ToolTip from "../helpers/ToopTip";
import { isDetected } from "../checkers/isDetected";
import { chainOptions } from "../helpers/ChainOptions";


const ec = new EllipticCurve.ec("secp256k1");


//Combining the publickey with signatureKey then calcuate the private key of stealth address

interface ChildProps {

  withdrawFunction: () => void;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
  setamountTowithdraw: React.Dispatch<React.SetStateAction<string | any>>;
  amountTowithdraw: string | any;
  show: string | any

}

export const Receive: React.FC<ChildProps> = ({
  withdrawFunction,
  setmasterkey,
  setamountTowithdraw,


}) => {


  var signaturekey: EC.KeyPair | any;
  const { ethereum }: any = window;



  const [savedSignaturekey, setsavedSignaturekey] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const [err, seterr] = useState<any>(false);
  const [pkCopied, setPkCopied] = useState<boolean>(false);



  const [transactionTab, setTransactionTab] = useState(false);
  const [trxList, settrxList] = useState<any>([]);
  const [logsArray, setlogsArray] = useState<any>([]);



  let currentNetwork: string | any = sessionStorage.getItem("chain");



  const contractaddress: string | any = useMemo(() => {

    const selectedChain = chainOptions.find((item) => currentNetwork === item.name);
    return selectedChain ? selectedChain.contract : null;

  }, [chainOptions, currentNetwork ,ethereum]);




  const provider = useMemo(() => {

    return new ethers.providers.Web3Provider(ethereum);

  }, [])



  const contract = useMemo(() => {

    return new ethers.Contract(contractaddress, Abi.abi, provider);

  }, [ethereum ,])



  const setwallet = async (key: string) => {


    let wallet = new ethers.Wallet(key);

    // Get the wallet address
    let add = wallet.address;

    const getbal = await provider.getBalance(add);
    const balance = ethers.utils.formatEther(getbal);



    const obj = {

      address: add?.slice(0, 6) + "..." + add?.slice(-4),
      balance: balance,
      key: key,

    }
    const arr = trxList.find((e: any) => {

      e.address === obj.address

    })

    if (!arr && Number(balance) > 0) settrxList((objs: any) => [...objs, obj] )





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



  const [initValue, setInitValue] = useState<number>(0);



  const fetch = async () => {

    isDetected()

    try {

      const tvl = await contract.pubKeysLen();
      setInitValue(tvl.toNumber());

    } catch (error) {

      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {

    fetch()

  }, [])




  const generateprivatekey = (): void => {

    if (savedSignaturekey === "") {
      signaturekey = ec.keyFromPrivate(signatureKey, "hex");
    } else {
      signaturekey = ec.keyFromPrivate(savedSignaturekey, "hex");
    }


  };


  useEffect(() => {
    
    if (initValue > 0) {
      const timer = setTimeout(() => {
        if (initValue >= 10) {
          setInitValue(initValue - 10); // Update initValue using state
        } else {
          setInitValue(0); // Ensure initValue doesn't go below zero
        }
      }, 950);


      return () => clearTimeout(timer); // Cleanup the timer

    } else {

      setInitValue(0);

      console.log('else', initValue);
    }
  }, [initValue]); // Trigger when initValue changes




  let signatureKey: string | any = sessionStorage.getItem("signature");


  const getKeys = async () => {

    setlogsArray(await contract.retrievePubKeys(BigNumber.from(initValue)));


    //declaring variables type here

    let keyPair: EC.KeyPair | any;
    let calculateSecret;
    let hashedSecret: any;
    let calculated_ss: string | any;
    let publicKey: any;
    let keys: any

    logsArray.forEach((logs: any) => {

      generateprivatekey()

      try {
        keys = `${logs.sharedSecret.replace("0x", "")}04${logs.x_cor.slice(2)}${logs.y_cor.slice(2)}`;

        if (keys === '00000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')
          return false;

        else {

          publicKey = keys.slice(4)
          //
          
          keyPair = ec.keyFromPublic(publicKey, "hex");
          calculateSecret = signaturekey.derive(keyPair.getPublic()); //
          hashedSecret = ec.keyFromPrivate(keccak256(calculateSecret.toArray()));

          calculated_ss = calculateSecret.toArray()[0].toString(16) + calculateSecret.toArray()[1].toString(16);


        }
      }
      catch (e: any) {
        seterr(e.message);
        console.log(e.message)
      }

      try {
        if (calculated_ss.toString() === keys.slice(0, 4).toString()) {

          // calculating private key

          const _key = signaturekey.getPrivate().add(hashedSecret.getPrivate());
          const privateKey = _key.mod(ec.curve.n);

          setwallet(privateKey.toString(16, 32));

          setsavedSignaturekey('')
        }

        return;

      } catch (e: any) {
        seterr(e.message);
      }

    })

  }

  useEffect(() => {

    if (initValue >= 0) {
      getKeys();
    }
  }, [initValue]); // Trigger when initValue changes


  const copykey = (pkey: string , index: number) => {

    navigator.clipboard.writeText(pkey);

    setPkCopied(true);

    try {
      withdrawFunction();
    } catch (e: any) {
      console.error(e);
    }

    downloadTxt("#walletprivateKey-" + pkey, "Forus-privatekey.txt");

    setmasterkey(pkey);


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
                <p className="text-gray-400">{z.address}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-left montserrat-small font-semibold">Balance </h2>
                <p className="text-gray-400">{z.balance}</p>
              </div>
              <div className="flex flex-col montserrat-small font-semibold justify-center items-end space-y-2">
                <h2 className="text-left">Private key </h2>
                {!pkCopied ? (
                  <ToolTip tooltip="Copy Private key">
                    <AiOutlineCopy
                      onClick={() => copykey(z.key , i)}
                      className={`text-gray-400 hover:text-green-400 font-bold cursor-pointer text-[1.2rem]`}
                    />
                  </ToolTip>
                ) : (
                  <MdOutlineDone
                    // onClick={() => copykey(z.key)}
                    className={`text-green-500 font-bold text-[1.2rem] text-highlight`}
                  />
                )}
              </div>
            </div>

          ))
        ) : (
          <h1 className="mb-12 text-center relative top-5 text-xl montserrat-small font-semibold  text-red-400">
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



          <div className="w-full flex justify-center pt-2 mr-4">
            <button
              onClick={fetch}
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

// export default Receive;