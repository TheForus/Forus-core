import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { keccak256 } from "ethers/lib.esm/utils";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { useContext } from "react";
import { AppContext } from "./Cryptia";
// import { AiOutlineCopy } from "react-icons/ai";
import { AiOutlineArrowsAlt, AiOutlineShrink } from "react-icons/ai";
import copy from "../assets/copy.jpg";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
const ec = new EllipticCurve.ec("secp256k1");

const Accept = () => {
  const connect = useContext(AppContext);
  const notyf = new Notyf();

  const [rootsecretkey, setrootsecretkey] = useState<string>("");
  const [privatekey, setprivatekey] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const [, setmatchingkey] = useState<boolean>(false);
  const [err, seterr] = useState<boolean>(false);
  const [reveal, setreveal] = useState<boolean | any>(false);
  const [iscopied, setiscopied] = useState<string>("");

  let zkeys: any[] = [];

  const { ethereum }: any = window;

  useEffect(() => {
    const fetchData = async () => {
      // try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = new ethers.Contract(
        connect.contractAddress,
        abi.abi,
        provider
      );

      const limit = await contract.getLimit();

      for (let i = 0; i < limit.toString(); i++) {
        let result: any = await contract.logs(i);

        zkeys.push(
          `C${result.ss.replace("0x", "")}04${result.r.slice(
            2
          )}${result.s.slice(2)}`
        );
        localStorage.setItem("ephLogs", JSON.stringify(zkeys));
      }
    };

    fetchData();
  }, []);

  const generateprivatekey = (): void => {
    const { ethereum }: any = window;
    if (!ethereum) {
      notyf.error("plz initialize metamask");
      return;
    }
    setmatchingkey(true);

    var secretkey: EC.KeyPair | any;
    let skey: string | any = localStorage.getItem("secretKey");
    if (rootsecretkey === "") {
      secretkey = ec.keyFromPrivate(skey, "hex");
    } else {
      secretkey = ec.keyFromPrivate(rootsecretkey, "hex");
    }

    var ephPubKey: EC.KeyPair | any;
    var sharedsecret;
    var hashedsecret;
    var _sharedSecret: string | any;

    const ephLogs: string[] | any = localStorage.getItem("ephLogs");
    const data: string[] | null[] = JSON.parse(ephLogs);
    console.log(data);

    if (data === null) {
      notyf.error("Plz try again");
      return;
    }
    data.forEach((z: any) => {
      ephPubKey = ec.keyFromPublic(z.slice(3), "hex");
      sharedsecret = secretkey.derive(ephPubKey.getPublic()); //
      hashedsecret = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      _sharedSecret =
        "0x" + sharedsecret.toArray()[0].toString(16).padStart(2, "0");
      console.log(
        z.slice(1, 3).toString(),
        _sharedSecret.toString().slice(2, 4)
      );

      try {
        if (_sharedSecret.toString().slice(2, 4) === z.slice(1, 3).toString()) {
          notyf.success("Matched");
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
    setmatchingkey(false);
  };

  const copykey = () => {
    navigator.clipboard.writeText(privatekey);
    setiscopied("Copied");
  };

  return (
    <>
      <div className="py-2 flex space-x-4 justify-center ml-6">
        {hide !== true && (
          <input
            type="text"
            className="bg-[#fffafa] font-semibold text-gray-700 montserrat-subtitle outline-none border rounded-md p-1 px-2 border-1 border-gray-400 w-[340px]"
            value={rootsecretkey}
            onChange={(e) => {
              setrootsecretkey(e.target.value);
            }}
            placeholder="Secretkey (optional)"
          />
        )}
        {hide && (
          <p className="text-[#58707e] p-1 px-2 font-semibold montserrat-small ">
            Expand to enter the savedKey (optional)
          </p>
        )}
        {/* expand icon (toggle of input button) */}
        {hide ? (
          <AiOutlineArrowsAlt
            className="cursor-pointer text-[#58707e]"
            size={25}
            onClick={() => sethide(!hide)}
          />
        ) : (
          <AiOutlineShrink
            className="cursor-pointer text-[#58707e]"
            size={25}
            onClick={() => sethide(!hide)}
          />
        )}
      </div>

      {/* Match key */}
      <div className="flex justify-center pt-2 mr-4">
        <div
          className="flex ml-1 dark:text-[#06324e] dark:hover:text-gray-300 dark:border-gray-700 items-center cursor-pointer space-x-1 border-1 p-1 hover:bg-gray-900 hover:text-[#10F1B4]  text-white bg-[#10F1B4] hover:shadow-xl px-4 text-center rounded-md  font-semibold hover:border-white border-[#10F1B4] border"
          onClick={generateprivatekey}
        >
          {/* <GiKangaroo size={26} /> */}
          <h2 className="montserrat-small">Match Key</h2>
        </div>
      </div>

      {/* message */}
      <div className="p-4  text-[#10F1B4]  font-semibold">
        {/* {matching === true ? <p>Running.....</p> : false} */}
        {reveal === true ? (
          <div className="flex ml-60  justify-center items-center space-x-3 montserrat-small">
            <p className="text-[#58707e]">{iscopied}</p>
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
            <p>{err && "Error : " + err}</p>
          </>
        )}
      </div>
    </>
  );
};

export default Accept;
