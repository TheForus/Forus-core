import { useState } from "react";
import { base58, keccak256 } from "ethers/lib/utils.js";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { useContext } from "react";
import { AppContext } from "./Cryptia";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { Crypto } from "../helper/Crypto";
import { BsChevronDown } from "react-icons/bs";
import { ethers } from "ethers";
import sending from "../Logos/sending.gif";
import { Notyf } from "notyf";
import BigNumber from "bignumber.js";
import { db } from "../config/firebase.js"
import { collection, addDoc } from "firebase/firestore";
import "notyf/notyf.min.css";

const ec = new EllipticCurve.ec("secp256k1");

const Transfer = () => {
  const notyf = new Notyf();

  const connect = useContext(AppContext);

  const XRCABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    "function symbol() external view returns (string memory)",
    "function name() external view returns (string memory)",
    "function approve(address owner, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint)",
  ];

  let r: any;
  let s: any;
  let a: any;

  // let ethers: any;

  const { ethereum }: any = window;

  const [token, settoken] = useState<string | "">("");
  const [cpMetaAddress, setcpMetaAddress] = useState<string | "">("");
  const [error, seterror] = useState<string | "">("");
  const [amount, setamount] = useState<string | "">("");
  const [show, setshow] = useState<boolean>(false);
  const [byDefault, setbyDefault] = useState<string>("XDC");
  const [trxid, settrxid] = useState<string>("");
  const [waiting, setwaiting] = useState<boolean>(false);

  var receipent: any;

  const validatingCr = (event: any) => {
    if (
      (event.target.value[0] !== "c" && event.target.value !== "") ||
      event.target.value.length > 49 ||
      event.target.value.length < 48
    ) {
      seterror("Invalid address");
      setTimeout(() => {
        seterror("");
      }, 4000);
    }

    setcpMetaAddress(event.target.value);
  };

  const setUp = async () => {
    let key: EC.KeyPair | any;
    let ephPublic: EC.KeyPair | any;
    // let receipent: string | null;

    const ephKey = ec.genKeyPair();
    ephPublic = ephKey.getPublic();

    try {
      if (cpMetaAddress.slice(0, 2) === 'cp') {
        console.log(cpMetaAddress.slice(0, 2))
        const _cpMetaAddress = cpMetaAddress.slice(2);
        const decoded = base58.decode(_cpMetaAddress);
        const decodedId = decoded.subarray(0, 33);
        key = ec.keyFromPublic(decodedId, "hex");

      } else {
        seterror("Plz enter the valid  cr address");
      }
    } catch (e: any) {
      seterror(e.message);
    }
    //
    try {
      const sharedsecret = ephKey.derive(key.getPublic());
      const hashed = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const suffix: string | any = hashed.getPublic().encode('hex', false).toString().slice(-6)
      const publicKey =
        key
          ?.getPublic()
          ?.add(hashed.getPublic())
          ?.encode("array", false)
          ?.splice(1) || [];
      const address = keccak256(publicKey);
      const _HexString = address.substring(address.length - 40, address.length);

      receipent = "0x" + _HexString;
      console.log(receipent);

      r = "0x" + ephPublic?.getX().toString(16, 64) || "";
      s = "0x" + ephPublic?.getY().toString(16, 64) || "";
      a = "0x" + sharedsecret.toArray()[0].toString(16).padStart(2, "0") + suffix;

    } catch (e) {
      console.log("error", e);
    }

    return true;
  };

  const logs = collection(db, "Logs");


  const storing = async () => {
    const stored = `T${a.replace("0x", "")}04${r.slice(2)}${s.slice(2)}`
    console.log(stored)
    try {
      await addDoc(logs, {
        keys: stored,

      });
    } catch (err) {
      console.error(err);
    }
    console.log('storing...')
  }

  const Transfer = async () => {
    setUp();

    if (!ethereum) {
      notyf.error("Please initialize MetaMask");
      return;
    }

    connect.validateChain();

    if (cpMetaAddress === "" || amount === "") {
      seterror("Please enter the cr address");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }
    // console.log('hey')

    setwaiting(true);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // const contract = new ethers.Contract(
    //   connect.contractAddress,
    //   Abi.abi,
    //   signer
    // );
    storing()
    try {
      const valueToSend = ethers.utils.parseEther(amount);
      // const transactionParameters = {
      //   value: valueToSend,
      // };

      console.log(`T${a.replace("0x", "")}04${r.slice(2)}${s.slice(2)}`)

      const transaction = {
        to: receipent,
        value: valueToSend
      };
    
      // Send the transaction
      const txResponse = await signer.sendTransaction(transaction);
      console.log("https://explorer.apothem.network/" +txResponse.hash);
      // const transferCoin = await contract.TransferXDC(
      //   r,
      //   s,
      //   a,
      //   receipent,
      //   transactionParameters
      // );

      // const txId = await transferCoin.wait();
      // const txId = await txResponse.wait();
      settrxid("https://explorer.apothem.network/" +txResponse.hash);
      storing()

      setcpMetaAddress("");
      setamount("");
      storing()
      console.log('stored..')
    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };

  const TransferToken = async () => {
    setUp();

    if (cpMetaAddress === "" || amount === "") {
      seterror("Please enter the address");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    setwaiting(true);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token, XRCABI, signer);

    // const contract = new ethers.Contract(
    //   connect.contractAddress,
    //   Abi.abi,
    //   signer
    // );

    try {
      //to send exact amount ow tokens are always counted as canto amount**18
      const amountParams: any = ethers.utils.parseUnits(amount, 18);
      const msgSender = sessionStorage.getItem("address");
      const transferCoin=await contract.transferFrom(msgSender,receipent,amountParams);
      // const transferCoin = await contract.TransferXRC20(
      //   r,
      //   s,
      //   a,
      //   token,
      //   receipent,
      //   amountParams
      // );
      const txId = await transferCoin.wait();
      settrxid("https://explorer.apothem.network/" + txId.transactionHash);
      storing()
      console.log('stored..')
    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };

  async function approve(): Promise<boolean> {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token, XRCABI, signer);

    try {
      const msgSender = sessionStorage.getItem("address");
      const res = await contract.allowance(msgSender, connect.contractAddress);
      const bigNumber = new BigNumber(res._hex);
      const allowance: string | any = bigNumber.toNumber() / 10 ** 18;
      console.log(allowance);

      if (allowance < amount) {
        const approvedAmount: any = ethers.utils.parseUnits(amount, 18);
        const approve = await contract.approve(
          connect.contractAddress,
          approvedAmount
        );
        await approve.wait();
        notyf.success("approved");

        TransferToken();
      } else {
        TransferToken();
      }
    } catch (e: any) {
      console.log(e.message);
      seterror(e.message);
    }
    return false;
  }

  async function proceed() {
    console.log('hello')
    if (!ethereum) {
      notyf.error("Please initialize MetaMask");
      return;
    }

    connect.validateChain();

    const provider = new ethers.providers.Web3Provider(ethereum); // Replace with the Infura project ID and network
    const contract = new ethers.Contract(token, XRCABI, provider);


    try{
      const balance = await contract.balanceOf(sessionStorage.getItem("address"));
      console.log(balance)
      const bigNumber = new BigNumber(balance._hex);
      const tospend: any = bigNumber.toNumber() / 10 ** 18;
      if (tospend >= amount) {
        approve();
      } else {
        notyf.error("insufficient balance");
      }
    }
    catch(err: any){console.log(err.message)}
   
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
        className=" py-1 w-[100%] hover:shadow-sm rounded-md 
       "
      >
        <input
          // style={{ border: '1px solid red' }}
          className=" text-[0.9rem] font-semibold text-gray-700
       montserrat-subtitle outline-none px-3 py-3   w-[100%] bg-[#ebf3f7]"
          type="text"
          onChange={validatingCr}
          placeholder="Receipent's Cp address"
        />
      </div>
      <div
        className="relative flex items-center  py-1 w-[100%] hover:shadow-sm rounded-md 
       "
      >
        <input
          className="text-[0.9rem] font-semibold text-gray-700
        montserrat-subtitle outline-none rounded-md py-3 px-3 w-[100%] bg-[#ebf3f7] "
          value={amount}
          type="text"
          placeholder="1 XDC"
          onChange={(e) => setamount(e.target.value)}
        />
        {/* Tokens Dropdown Menu */}
        <div className="min-w-[95px] absolute right-1">
          <ul onClick={() => setshow(!show)}>
            <li
              className="flex p-2 px-3 cursor-pointer
            text-[#181b1f] font-semibold border-l border-gray-300
            items-center gap-2 hover:text-gray-800 hover:rounded-full hover:bg-[#dbe6eb] "
            >
              <p>{byDefault}</p>
              <BsChevronDown color="grey" size={18} />
            </li>
            <div
              className={`
              ${show &&
                `transition-all ease-in bg-white py-1 shadow-md flex flex-col w-[105%] max-h-28 rounded-b-md absolute mt-2
                 scrollbar-thin scrollbar-thumb-[#181b1f] scrollbar-track-[#dbe6eb] overflow-y-scroll 
                scrollbar-thumb-rounded scrollbar-rounded-full`
                }
            `}
            >
              {show &&
                Crypto.map((c) => (
                  <div className="h-40 border-b border-gray-100">
                    <li
                      className="flex flex-row-reverse p-1 px-3 cursor-pointer
                    text-gray-700 font-semibold border-l border-gray-300 
                    items-center gap-2 hover:text-gray-900 hover:bg-[#dbe6eb] 
                     montserrat-small text-[0.7rem]
                    justify-between"
                      key={c.name}
                      onClick={() => changedefault(c)}
                    >
                      <img src={c.symbol} alt="" height={14} width={18} />
                      <p>{c.name}</p>
                    </li>
                  </div>
                ))}
            </div>
          </ul>
        </div>
      </div>
      <button
        className="  flex montserrat-small mx-auto items-center cursor-pointer space-x-1 border-1 p-1 text-[#ebf3f7] bg-[#181b1f] 
        hover:shadow-xl px-7 text-center rounded-md font-semibold hover:border-white border-[#181b1f] border"
        onClick={byDefault === "XDC" ? Transfer : proceed}
      >
        {waiting === false ? (
          "Send"
        ) : (
          <img height={30} width={30} src={sending} alt="" />
        )}
      </button>

      <p
        onClick={viewtrx}
        className="montserrat-subtitle  text-gray-500 font-semibold underline underline-offset-8 decoration-[#181b1f] cursor-pointer"
      >
        {trxid !== "" ? trxid.slice(8, 58) : ""}
      </p>
      <p className="montserrat-subtitle text-[#181b1f] font-semibold flex mx-auto items-center">
        {error}
      </p>
    </div>
  );
};

export default Transfer;
