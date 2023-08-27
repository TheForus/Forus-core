import { useState } from "react";
import { base58, keccak256 } from "ethers/lib/utils.js";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { useContext } from "react";
import { AppContext } from "./Forus";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { EthTokens, XdcTokens, ftmTokens } from "../helper/Tokens";
import { BsChevronDown } from "react-icons/bs";
import { ethers } from "ethers";
import sending from "../Logos/sending.gif";
import { Notyf } from "notyf";
import BigNumber from "bignumber.js";
import { db } from "../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { apothemcontractAddress, fantomcontractAddress, contractAddress } from "../helper/contractAddresses";
import "notyf/notyf.min.css";

const ec = new EllipticCurve.ec("secp256k1");

const Transfer = () => {
  const notyf = new Notyf();
  let currentNetwork: string | any = sessionStorage.getItem("chain")

  const connect = useContext(AppContext);


  const ERCABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    "function symbol() external view returns (string memory)",
    "function name() external view returns (string memory)",
    "function approve(address owner, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint)",
  ];

  let r: string | any;
  let s: string | any;
  let v: string | any;

  // let ethers: any;

  const { ethereum }: any = window;

  const [token, settoken] = useState<string | "">("");
  const [forusKey, setforusKey] = useState<string | "">("");
  const [error, seterror] = useState<string | "">("");
  const [amount, setamount] = useState<string | "">("");
  const [show, setshow] = useState<boolean>(false);
  const [byDefault, setbyDefault] = useState<string>(currentNetwork === "Apothem" ? "XDC" : currentNetwork === "fantom testnet" ? "FTM" : "ETH");
  const [trxid, settrxid] = useState<string>("");
  const [waiting, setwaiting] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState<string>("Transfer");

  const msgSender: string | any = sessionStorage.getItem("address");

  var receipentAddress: any;

  const validatingForuskey = (event: any) => {
    if (
      (event.target.value.slice(0, 2).toLowerCase() !== "fk" &&
        event.target.value !== "") ||
      event.target.value.length > 49 ||
      event.target.value.length < 48
    ) {
      seterror("Invalid address");
      setTimeout(() => {
        seterror("");
      }, 4000);
    }

    setforusKey(event.target.value);
  };



  const setUpStealthAddress = async () => {

    let key: EC.KeyPair | any;
    let ephemeralPublic: EC.KeyPair | any;
    // let receipentAddress: string | null;

    const ephemeralPrivateKey = ec.genKeyPair();
    ephemeralPublic = ephemeralPrivateKey.getPublic();

    /*
         removing the prefix "fk" of the forus key then decoding it to generate an stealth address
    */

    try {
      if (forusKey.slice(0, 2).toLowerCase() === "fk") {
        const _forusKey = forusKey.slice(2);
        const decoded = base58.decode(_forusKey);
        const decodedId = decoded.subarray(0, 33);
        key = ec.keyFromPublic(decodedId, "hex");
      } else {
        seterror("Plz enter the valid forus key");
      }
    } catch (e: any) {
      seterror(e.message);
    }

    /*
         Now generating the stealth address by doing some elliptic curve calculation here
      */
    try {
      const sharedsecret = ephemeralPrivateKey.derive(key.getPublic());
      const hashedSecret = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const suffix: string | any = hashedSecret
        .getPublic()
        .encode("hex", false)
        .toString()
        .slice(-6);
      const publicKey =
        key
          ?.getPublic()
          ?.add(hashedSecret.getPublic())
          ?.encode("array", false)
          ?.splice(1) || [];
      const address = keccak256(publicKey);
      const _HexString = address.substring(address.length - 40, address.length);

      receipentAddress = "0x" + _HexString;


      r = "0x" + ephemeralPublic?.getX().toString(16, 64) || "";
      s = "0x" + ephemeralPublic?.getY().toString(16, 64) || "";
      v = "0x" + sharedsecret.toArray()[0].toString(16).padStart(2, "0") + suffix;

    } catch (e) {
      console.log("error", e);
    }

    return true;
  };

  const logs = collection(db, "Logs");


  /*
     storing the ephemeral public key in firebase along with blockchain to easily and effeciantly retreive
 the keys  */

  const storing = async () => {
    const stored = `T${v.replace("0x", "")}04${r.slice(2)}${s.slice(2)}`;
    try {
      await addDoc(logs, {
        Keys: stored,
      });
    } catch (err) {
      console.error(err);
    }
    console.log("storing...");
  };

  const Transfer = async () => {


    setUpStealthAddress();


    if (!ethereum) {
      notyf.error("Please initialize MetaMask");
      return;
    }

    connect.validateChain();

    if (forusKey === "" || amount === "") {
      seterror("Please enter the forus key");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    setwaiting(true);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    let contract: any;
    if (currentNetwork === 'Sepolia') {
      contract = new ethers.Contract(contractAddress, Abi.abi, signer);
      console.log(sessionStorage.getItem("chain"))
    }
    if (currentNetwork === 'Apothem') {
      contract = new ethers.Contract(apothemcontractAddress, Abi.abi, signer);
    }

    if (currentNetwork === 'fantom testnet') {
      contract = new ethers.Contract(fantomcontractAddress, Abi.abi, signer);

    }



    try {
      const valueToSend = ethers.utils.parseEther(amount);
      const transactionParameters = {
        value: valueToSend,
      };
      const transferCoin = await contract.Transfer(
        r,
        s,
        v,
        receipentAddress,
        transactionParameters
      );
      const txId = await transferCoin;


      switch (currentNetwork) {

        case "Sepolia":
          settrxid("https://sepolia.etherscan.io/tx/" + txId.hash)
          break;

        case "Apothem":
          settrxid("https://explorer.apothem.network/txs/" + txId.hash)
          break

        case "fantom testnet":
          settrxid("https://explorer.testnet.fantom.network/transactions/" + txId.hash)
          break

        default:
          break

      }

      storing();

      setforusKey("");

      setamount("");

    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };

  const TransferToken = async () => {
    setUpStealthAddress();
    if (forusKey === "" || amount === "") {
      seterror("Please enter the address");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }
    setwaiting(true);
    const provider = new ethers.providers.Web3Provider(ethereum);

    const signer = provider.getSigner();

    let contract: any;

    if (connect.selectedChain === 'Sepolia') {
      contract = new ethers.Contract(connect.contractAddress, Abi.abi, signer);
      console.log(connect.chainname)
    }
    if (connect.selectedChain === 'Apothem') {
      contract = new ethers.Contract(connect.apothemcontractAddress, Abi.abi, signer);
      console.log(connect.chainname)
    }
    try {
      //to send exact amount of tokens are always counted as  amount**18
      const amountParams: any = ethers.utils.parseUnits(amount, 18);
      try {
        console.log(receipentAddress, amountParams);
        // const transferCoin=await contract.transfer(receipentAddress, amountParams);
        const transferERC20 = await contract.TransferERC20(
          r,
          s,
          v,
          token,
          receipentAddress,
          amountParams
        );
        const txResponse = await transferERC20;
        settrxid("https://sepolia.etherscan.io/tx/" + txResponse.hash);
      } catch (err: any) {
        console.log(err.message);
        seterror(err.message);
      }
      //storing the ephemeral key in db
      storing();
      console.log("stored..");
    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };

  async function approve() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token, ERCABI, signer);

    try {
      const res = await contract.allowance(msgSender, connect.contractAddress);
      const bigNumber = new BigNumber(res._hex);
      const allowance: string | any = bigNumber.toNumber() / 10 ** 18;
      // console.log(allowance);

      if (allowance < amount) {
        setButtonState("approving..");
        const approvedAmount: any = ethers.utils.parseUnits(amount, 18);
        const approve = await contract.approve(
          connect.contractAddress,
          approvedAmount
        );
        const txResponse = await approve;
        console.log("https://sepolia.etherscan.io/tx/" + txResponse.hash);
        setButtonState("Transfer");
        notyf.success("approved");

        setTimeout(() => {
          TransferToken();
        }, 2000);
      } else {
        TransferToken();
      }
    } catch (e: any) {
      console.log(e.message);
      seterror(e.message);
    }
  }

  async function proceed() {
    if (!ethereum) {
      notyf.error("Please initialize MetaMask");
      return;
    }

    connect.validateChain();

    const provider = new ethers.providers.Web3Provider(ethereum); //
    const contract = new ethers.Contract(token, ERCABI, provider);

    try {
      const balance = await contract.balanceOf(
        sessionStorage.getItem("address")
      );
      // console.log(balance)
      const bigNumber = new BigNumber(balance._hex);
      const tospend: any = bigNumber.toNumber() / 10 ** 18;
      if (tospend >= amount) {
        approve();
      } else {
        notyf.error("insufficient balance");
      }
    } catch (err: any) {
      console.log(err.message);
      seterror(err.message);
    }
  }

  const changedefault = (c: any) => {
    setshow(!show);
    setbyDefault(c.name);
    settoken(c.address);
  };

  const viewtrx = () => {
    if (trxid !== "") {
      window.open(trxid, "_blank");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4 ">
      <div
        className=" py-1 w-[100%]  rounded-md 
       "
      >
        <input
          // style={{ border: '1px solid red' }}
          className=" text-[0.9rem] font-semibold text-gray-900 placeholder:text-gray-700
       montserrat-subtitle outline-none px-3 py-3 h-[100%] hover:shadow-sm rounded-md hover:shadow-gray-400 w-[100%] bg-bgGray"
          type="text"
          onChange={validatingForuskey}
          placeholder="Forus Key"
        />
      </div>
      <div
        className="relative flex items-center  py-1 w-[100%] hover:shadow-sm rounded-md 
       "
      >
        <input
          className="text-[0.9rem] font-semibold text-gray-900 placeholder:text-gray-700
        montserrat-subtitle outline-none py-3 px-3 h-[100%] hover:shadow-sm rounded-md hover:shadow-gray-400 w-[100%] bg-bgGray "
          value={amount}
          type="text"
          placeholder="0.1"
          onChange={(e) => setamount(e.target.value)}
        />
        {/* Tokens Dropdown Menu */}
        <div className="min-w-[95px] absolute right-1 ">
          <ul className="" onClick={() => setshow(!show)}>
            <li
              className="flex p-2 px-3 cursor-pointer rounded-md 
            text-[#1f2429] font-semibold border-l border-gray-300
            items-center gap-2 hover:text-gray-800 hover:rounded-full hover:bg-[#dbe6eb] "
            >
              <p>{byDefault}</p>
              <BsChevronDown className="text-gray-900" size={18} />
            </li>
            <div
              className={`
              ${show &&
                `transition-all ease-in bg-bgGray py-1 shadow-md flex flex-col w-[105%] max-h-28 rounded-b-md absolute mt-2
                 scrollbar-thin scrollbar-thumb-bgGray scrollbar-track-[#dbe6eb] overflow-y-scroll 
                scrollbar-thumb-rounded scrollbar-rounded-full`
                }
            `}
            >
              {show ?

                currentNetwork === 'Apothem' ? XdcTokens.map((c) => (
                  <div className="h-40 border-b border-gray-400 ">
                    <li
                      className="flex flex-row-reverse p-1 px-3 cursor-pointer
                    text-gray-900 font-semibold border-l border-gray-100 
                    items-center gap-2 hover:text-gray-900 hover:bg-[#dbe6eb] 
                    montserrat-small text-[0.8rem]
                    justify-between"
                      key={c.name}
                      onClick={() => changedefault(c)}
                    >
                      <img className=" rounded-lg" src={c.symbol} alt="" height={14} width={18} />
                      <p>{c.name}</p>
                    </li>
                  </div>
                )) : currentNetwork === 'fantom testnet' ? ftmTokens.map((c) => (
                  <div className="h-40 border-b border-gray-400 ">
                    <li
                      className="flex flex-row-reverse p-1 px-3 cursor-pointer
                    text-gray-900 font-semibold border-l border-gray-100 
                    items-center gap-2 hover:text-gray-900 hover:bg-[#dbe6eb] 
                    montserrat-small text-[0.8rem]
                    justify-between"
                      key={c.name}
                      onClick={() => changedefault(c)}
                    >
                      <img className=" rounded-lg" src={c.symbol} alt="" height={14} width={18} />
                      <p>{c.name}</p>
                    </li>
                  </div>
                )) :
                  EthTokens.map((c) => (
                    <div className="h-40 border-b border-gray-400 ">
                      <li
                        className="flex flex-row-reverse p-1 px-3 cursor-pointer
                    text-gray-900 font-semibold border-l border-gray-100 
                    items-center gap-2 hover:text-gray-900 hover:bg-[#dbe6eb] 
                    montserrat-small text-[0.8rem]
                    justify-between"
                        key={c.name}
                        onClick={() => changedefault(c)}
                      >
                        <img className=" rounded-lg" src={c.symbol} alt="" height={14} width={18} />
                        <p>{c.name}</p>
                      </li>
                    </div>
                  ))


                : ''}
            </div>
          </ul>
        </div>
      </div>
      <button
        className="mb-4 my-2 montserrat-subtitle border-1 p-1 montserrat-subtitle  
        bg-highlight  hover:shadow-xl px-6 text-center  bg-slate-300 text-black 
       rounded-md  font-semibold   hover:scale-105 transition-all ease-linear "
        onClick={byDefault === "ETH" || byDefault === "XDC" || byDefault === "FTM" ? Transfer : proceed}
      >
        {waiting === false ? (
          buttonState
        ) : (
          <img height={30} width={30} src={sending} alt="" />
        )}
      </button>

      <p
        onClick={viewtrx}
        className="montserrat-subtitle  text-gray-500 font-semibold underline underline-offset-8 decoration-bgGray cursor-pointer"
      >
        {trxid !== "" ? trxid.slice(8, 58) : ""}
      </p>
      <p className="montserrat-subtitle text-bgGray font-semibold flex mx-auto items-center">
        {error}
      </p>
    </div>
  );
};

export default Transfer;
