import { useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { AiOutlineArrowsAlt, AiOutlineShrink } from "react-icons/ai";
import copy from "../Logos/copy.jpg";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { db } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { downloadTxt } from "../helper/downloadTxt";
const ec = new EllipticCurve.ec("secp256k1");

//Combining the publickey with signatureKey to calcuate the private key of stealth address

const Accept = () => {
  const notyf = new Notyf();
  var signaturekey: EC.KeyPair | any;

  const [savedSignaturekey, setsavedSignaturekey] = useState<string>("");
  const [privatekey, setprivatekey] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const [, setmatchingkey] = useState<boolean>(false);
  const [err, seterr] = useState<any>(false);
  const [reveal, setreveal] = useState<boolean | any>(false);
  const [iscopied, setiscopied] = useState<string>("");
  const [id, setId] = useState<string | any>("");
  const [isfounded, setisfounded] = useState<string>("");

  const keys = collection(db, "Logs");

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

    var ephPubKey: EC.KeyPair | any;
    var sharedsignature;
    var hashedsignature;
    var _sharedsignature: string | any;

    logs.forEach((z: any, index: number) => {
      ephPubKey = ec.keyFromPublic(z.Keys.slice(9), "hex");
      sharedsignature = signaturekey.derive(ephPubKey.getPublic()); //
      hashedsignature = ec.keyFromPrivate(keccak256(sharedsignature.toArray()));
      const suffix: string | any = hashedsignature
        .getPublic()
        .encode("hex", false)
        .toString()
        .slice(-6);
      _sharedsignature =
        "0x" +
        sharedsignature.toArray()[0].toString(16).padStart(2, "0") +
        suffix;

      try {
        if (
          _sharedsignature.toString().slice(2, 10) ===
          z.Keys.slice(1, 9).toString()
        ) {
          setId(z.id);
          setisfounded("founded");
          const _key = signaturekey
            .getPrivate()
            .add(hashedsignature.getPrivate());
          const privateKey = _key.mod(ec.curve.n);
          setprivatekey(privateKey.toString(16, 32));
          setiscopied("Copy");
          setreveal(true);
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

  const removingKey = async () => {
    const Doc = doc(db, "Logs", id);
    await deleteDoc(Doc);
  };

  const copykey = () => {
    navigator.clipboard.writeText(privatekey);
    setiscopied("Copied");
    downloadTxt(privatekey, "Forus-privatekey.txt");

    /// remove the key from firebase database
    removingKey();
  };

  return (
    <>
      <h2 className="text-bgGray text-[1.3rem] text-left mb-3">Signature </h2>
      <div className="py-2 flex space-x-1 justify-center mx-2">
        {hide !== true && (
          <input
            type="text"
            className="text-[0.9rem] font-semibold text-gray-100 placeholder:text-gray-500
            montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
             hover:border-gray-400 w-[100%] bg-black/40 border-2 border-gray-500"
            // className="text-[0.9rem] tect font-semibold text-gray-700 placeholder:text-gray-700
            // montserrat-subtitle outline-none px-3 py-3 h-[100%] hover:shadow-sm
            //  rounded-md hover:shadow-gray-400 w-[100%] bg-bgGray"
            // className="bg-[#ebf3f7] font-semibold text-gray-700 montserrat-subtitle outline-none border rounded-md p-1 px-2 border-1 border-gray-400 w-[340px]"
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
          bg-highlight  hover:shadow-xl px-6 text-center bg-gray-300 text-black 
         rounded-md font-bold hover:bg-gray-100 transition-all ease-linear"
          onClick={generateprivatekey}
        >
          {/* <GiKangaroo size={26} /> */}
          <h2 className="montserrat-small">Accept</h2>
        </div>
      </div>

      {/* message */}
      <div className="p-4  text-bgGray  font-semibold">
        {/* {matching === true ? <p>Running.....</p> : false} */}
        {reveal === true ? (
          <div className="flex ml-60  justify-center items-center space-x-3 ">
            <p className="text-bgGray montserrat-subtitle text-[0.9rem] ">
              {iscopied}
            </p>
            <img
              height={30}
              width={30}
              src={copy}
              onClick={copykey}
              className="cursor-pointer"
              alt=""
            />
          </div>
        ) : (
          <>
            {/* <p>{founded !== "founded" && "Key doesnt exist"}</p> */}
            <p className="montserrat-subtitle text-red-400 font-semibold ">
              {err && "Unfortunate : " + err}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Accept;
