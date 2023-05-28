import { useState } from "react";
import { keccak256 } from "ethers/lib.esm/utils";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
// import { AiOutlineCopy } from "react-icons/ai";
import { AiOutlineArrowsAlt, AiOutlineShrink } from "react-icons/ai";
import copy from "../Logos/copy.png";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { db } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { downloadTxt } from "../helper/downloadTxt";
const ec = new EllipticCurve.ec("secp256k1");

const Scan = () => {
  const notyf = new Notyf();
  var secretkey: EC.KeyPair | any;

  const [rootsecretkey, setrootsecretkey] = useState<string>("");
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
    var sharedsecret;
    var hashedsecret;
    var _sharedSecret: string | any;

    logs.forEach((z: any, index: number) => {
      ephPubKey = ec.keyFromPublic(z.keys.slice(9), "hex");
      sharedsecret = secretkey.derive(ephPubKey.getPublic()); //
      hashedsecret = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const suffix: string | any = hashedsecret
        .getPublic()
        .encode("hex", false)
        .toString()
        .slice(-6);
      _sharedSecret =
        "0x" + sharedsecret.toArray()[0].toString(16).padStart(2, "0") + suffix;
      console.log(
        _sharedSecret,
        _sharedSecret.toString().slice(2, 10),
        z.keys.slice(1, 9)
      );

      try {
        if (
          _sharedSecret.toString().slice(2, 10) ===
          z.keys.slice(1, 9).toString()
        ) {
          setId(z.id);
          setisfounded("founded");
          const _key = secretkey.getPrivate().add(hashedsecret.getPrivate());
          const pk = _key.mod(ec.curve.n);
          setprivatekey(pk.toString(16, 32));
          setiscopied("Copy");
          setreveal(true);
          setrootsecretkey("");
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

    let skey: string | any = sessionStorage.getItem("secretKey");
    if (rootsecretkey === "") {
      secretkey = ec.keyFromPrivate(skey, "hex");
    } else {
      secretkey = ec.keyFromPrivate(rootsecretkey, "hex");
    }

    fetchData();

    if (isfounded === "founded") {
      notyf.success("Matched");
    }

    setmatchingkey(false);
  };

  const removingKey = async () => {
    console.log(id);
    const Doc = doc(db, "Logs", id);
    await deleteDoc(Doc);
  };

  const copykey = () => {
    navigator.clipboard.writeText(privatekey);
    setiscopied("Copied");
    downloadTxt(privatekey, "Cryptia-privatekey.txt");

    /// remove the key from firebase database
    removingKey();
  };

  return (
    <>
      <div className="py-2 flex space-x-4 justify-center ml-6">
        {hide !== true && (
          <input
            type="text"
            className=" text-[0.9rem] font-semibold text-gray-700
            montserrat-subtitle outline-none px-3 py-3 h-[100%] hover:shadow-sm rounded-md hover:shadow-gray-400 w-[100%] bg-[#ebf3f7]"
            // className="bg-[#ebf3f7] font-semibold text-gray-700 montserrat-subtitle outline-none border rounded-md p-1 px-2 border-1 border-gray-400 w-[340px]"
            value={rootsecretkey}
            onChange={(e) => {
              setrootsecretkey(e.target.value);
            }}
            placeholder="Secretkey (optional)"
          />
        )}
        {hide && (
          <p className="text-[#181b1f] p-1 px-2 font-semibold montserrat-small ">
            Expand to enter the savedKey (optional)
          </p>
        )}
        {/* expand icon (toggle of input button) */}
        {hide ? (
          <AiOutlineArrowsAlt
            className="cursor-pointer text-[#181b1f]"
            size={25}
            onClick={() => sethide(!hide)}
          />
        ) : (
          <AiOutlineShrink
            className="cursor-pointer text-[#181b1f]"
            size={25}
            onClick={() => sethide(!hide)}
          />
        )}
      </div>

      {/* Match key */}
      <div className="flex justify-center pt-2 mr-4">
        <div
          className="flex ml-1  items-center cursor-pointer space-x-1 border-1 p-1 hover:bg-gray-900 hover:border-none  text-white bg-[#181b1f] hover:shadow-xl px-4 text-center rounded-md  font-semibold hover:border-white border-[#181b1f] border"
          onClick={generateprivatekey}
        >
          {/* <GiKangaroo size={26} /> */}
          <h2 className="montserrat-small">Scan Key</h2>
        </div>
      </div>

      {/* message */}
      <div className="p-4  text-[#181b1f]  font-semibold">
        {/* {matching === true ? <p>Running.....</p> : false} */}
        {reveal === true ? (
          <div className="flex ml-60  justify-center items-center space-x-3 montserrat-small">
            <p className="text-[#181b1f]">{iscopied}</p>
            <img
              height={20}
              width={20}
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

export default Scan;
