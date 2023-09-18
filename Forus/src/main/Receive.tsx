import { useEffect, useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import { useNavigate } from "react-router-dom";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { AiOutlineArrowsAlt, AiOutlineShrink } from "react-icons/ai";
import copy from "../Logos/copy.jpg";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { db } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { downloadTxt } from "../helper/downloadTxt";
import { ethers } from "ethers";
import { MdHistory } from "react-icons/md";



const ec = new EllipticCurve.ec("secp256k1");

//Combining the publickey with signatureKey to calcuate the private key of stealth address

interface ChildProps {
  withdrawFunction: () => void;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
}

const Receive: React.FC<ChildProps> = ({ withdrawFunction, setmasterkey }) => {


  const notyf = new Notyf();
  var signaturekey: EC.KeyPair | any;
  const { ethereum }: any = window;

  let retrievedArray: any[] = [];

  const [savedSignaturekey, setsavedSignaturekey] = useState<string>("");
  const [privateKey, setprivatekey] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const [, setmatchingkey] = useState<boolean>(false);
  const [err, seterr] = useState<any>(false);
  const [id, setId] = useState<string | any>("");
  const [isfounded, setisfounded] = useState<string>("");


  const keys = collection(db, "Logs");

  const [transactionTab, setTransactionTab] = useState(false);
  const [rArray, setRArray] = useState<any>([]);

  let array: any[] = [{

  }];


  async function getBalance(address: any) {

    const provider = new ethers.providers.Web3Provider(ethereum);
    const balance = await provider.getBalance(address);
    console.log(balance.toNumber());
    return ethers.utils.formatEther(balance);

  }


  const setwallet = async () => {
    let wallet = new ethers.Wallet(privateKey);

    // Get the wallet address
    let add = wallet.address;
    console.log(add, privateKey);

    const balance = await getBalance(add);


    array.push({ address: add?.slice(0, 6) + add?.slice(-4), balance: balance, key: privateKey });
    const arrayJson = JSON.stringify(array);
    sessionStorage.setItem('array', arrayJson);

    //getting array

    const retrievedArrayJson: any = sessionStorage.getItem('array');

    // Parse the JSON string back into an array
    retrievedArray = JSON.parse(retrievedArrayJson);

    setRArray(retrievedArray); // storing retreivedArray in RrArray state

    console.log("retrievedArray", retrievedArray)
  }

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


      prefix = sharedSecret.toArray()[0].toString(16) + sharedSecret.toArray()[1].toString(16)
      // console.log(prefix.toString(), z.Keys.slice(0, 4).toString())
      try {
        if (prefix.toString() === z.Keys.slice(0, 4).toString()) {

          setId(z.id);
          setisfounded("founded");

          const _key = signaturekey.getPrivate().add(hashedSecret.getPrivate());
          const privateKey = _key.mod(ec.curve.n);
          setprivatekey(privateKey.toString(16, 32));

          setwallet()

          setsavedSignaturekey("");


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

    generateprivatekey()
    console.log("retrievedArray : ", rArray)

  }, [])

  const removingKey = async () => {
    const Doc = doc(db, "Logs", id);
    await deleteDoc(Doc);
  };


  const copykey = (pkey: string) => {
    navigator.clipboard.writeText(pkey);

    try {
      withdrawFunction()
    }
    catch (e: any) {
      console.error(e)
    }

    downloadTxt('#walletprivateKey-' + pkey, "Forus-privatekey.txt");

    setmasterkey(pkey)
    console.log(pkey)

    /// remove the key from firebase database
    removingKey();

  };



  return (
    <>
      <div className="flex px-5 justify-between items-center">
        <h2 className="text-bgGray text-[1.3rem] text-left mb-3">Signature </h2>
        <h2 className="flex cursor-pointer hover:text-white text-gray-400 text-[1rem] text-left mb-3"
          onClick={() => setTransactionTab(!transactionTab)}>
          <span>
            <MdHistory className="text-[1.3rem] text-gray-400" />
          </span>{`\t`}_
          View Transactions{" "}
        </h2>
      </div>
      {transactionTab ? (
        rArray.length > 0 ? rArray.map((z: any, i: any) => (
          // <div key={i} className=" text-white ">
          <>
            <p className="text-white">{z.address}</p>
            <p className="text-white">{z.balance}</p>
            <img alt="" src={copy} className="h-6 w-6" onClick={() => copykey(z.key)} />
          </>

        ))
          :
          <h1 className="text-3xl text-white">No Transactions !!!</h1>
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
              <p className="text-gray-400 p-1 font-semibold montserrat-small ">
                Expand to enter the signatureKey (optional)
              </p>
            )}
            {/* expand icon (toggle of input button) */}
            <div className="flex items-center">
              {hide ? (
                <AiOutlineArrowsAlt
                  className=" cursor-pointer  text-[#a7acb3]"
                  size={34}
                  onClick={() => sethide(!hide)}
                />
              ) : (
                <AiOutlineShrink
                  className="cursor-pointer  text-[#a7acb3]"
                  size={34}
                  onClick={() => sethide(!hide)}
                />
              )}
            </div>
          </div>

          {/* Match key */}
          <div className="cursor-pointer flex justify-center pt-2 mr-4">
            <div
              className="w-[95%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black
          rounded-md font-bold hover:border-highlight hover:text-highlight transition-all ease-linear"
              onClick={generateprivatekey}
            >
              {/* <GiKangaroo size={26} /> */}
              <h2 className="montserrat-small">Receive</h2>
            </div>
          </div>

        </div>

      )}

    </>
  );
};

export default Receive;