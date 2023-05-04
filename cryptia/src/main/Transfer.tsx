import { useState } from "react";
import { base58, keccak256, getAddress } from "ethers/lib/utils.js";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { useContext } from "react";
import { AppContext } from "./Cryptia";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { Crypto } from "../helper/Crypto";
import { BsChevronDown } from "react-icons/bs";
import { ethers } from "ethers";
import sending from '../Logos/sending.gif'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const ec = new EllipticCurve.ec("secp256k1");


const Transfer = () => {
  const notyf = new Notyf();

  const connect = useContext(AppContext);

  const ERCABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function symbol() external view returns (string memory)",
    "function name() external view returns (string memory)",
  ];

  let r: string | null;
  let s: string | null;
  let a: string | null;

  // let ethers: any;

  // const contractAddress = '0x6340e1ed7DCe39ccA016C1805286Aa11536b4F3a'
  const { ethereum }: any = window;

  const [token, settoken] = useState<string | "">("");
  const [CrMetaAddress, setCrMetaAddress] = useState<string | "">("");
  const [error, seterror] = useState<string | "">("");
  const [amount, setamount] = useState<string | "">("");
  const [show, setshow] = useState<boolean>(false);
  const [byDefault, setbyDefault] = useState<string>("CANTO");
  const [trxid, settrxid] = useState<string>("");
  const [waiting, setwaiting] = useState<boolean>(false);
  // const [receipent, setreceipent] = useState<string>("");

  // let receipent: any;
  // console.log('receipent', receipent)
  var receipent: any;

  const validatingCr = (event: any) => {
    if (
      (event.target.value[0] !== "C" && event.target.value !== "") ||
      event.target.value.length > 48 ||
      event.target.value.length < 47
    ) {
      seterror("Invalid address");
      setTimeout(() => {
        seterror("");
      }, 4000);
    }

    setCrMetaAddress(event.target.value);
  };

  const setUp = async () => {
    let meta: EC.KeyPair | any;
    let ephPublic: EC.KeyPair | any;
    // let receipent: string | null;

    const ephKey = ec.genKeyPair();
    ephPublic = ephKey.getPublic();

    try {
      if (CrMetaAddress.startsWith("C")) {
        const _CrMetaAddress = CrMetaAddress.slice(1);
        const decoded = base58.decode(_CrMetaAddress);
        const decodedId = decoded.subarray(0, 33);
        meta = ec.keyFromPublic(decodedId, "hex");
        // console.log(meta)
      } else {
        seterror("Plz enter the valid  cr address");
      }
    } catch (e: any) {
      seterror(e.message);
    }
    //
    try {
      const sharedsecret = ephKey.derive(meta.getPublic());
      const hashed = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const publicKey =
        meta
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
      a = "0x" + sharedsecret.toArray()[0].toString(16).padStart(2, "0");
    } catch (e) {
      console.log("error", e);
    }

    return true;
  };



  const Transfer = async () => {
    setUp();

    if (!ethereum) {
      notyf.error("Please initialize MetaMask");
      return;
    }

    connect.validateChain()

  

    if (CrMetaAddress === "" || amount === "") {
      seterror("Please enter the cr address");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    setwaiting(true);

    const provider = new ethers.providers.Web3Provider(ethereum); // Replace with the Infura project ID and network
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(
      connect.contractAddress,
      Abi.abi,
      signer
    );
    console.log(connect.contractAddress, amount, receipent);

    try {
      const valueToSend = ethers.utils.parseEther(amount);
      const transactionParameters = {
        value: valueToSend,
      };

      const transferCoin = await contract.TransferCoin(
        r,
        s,
        a,
        receipent,
        transactionParameters
      ); // Replace methodName with the desired method

      const txId = await transferCoin.wait();
      console.log(txId.hash);
      settrxid("https://testnet.tuber.build/tx/" + txId.transactionHash);
      console.log(txId.hash);


      setCrMetaAddress("");
      setamount("");
    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };

  async function checkBalance(): Promise<boolean> {
    const provider = new ethers.providers.Web3Provider(ethereum); // Replace with the Infura project ID and network

    const contract = new ethers.Contract(token, ERCABI, provider);

    const balance = await contract.balanceOf(sessionStorage.getItem("address"));
    if (balance > amount) {
      return true;
    }

    return false

  }

  const TransferToken = async () => {
    if (!ethereum) {
      notyf.error("Please initialize MetaMask");
      return;
    }
    connect.validateChain()

    if (connect.validateChain() !== true) {
      return
    }




    if (CrMetaAddress === "" || amount === "") {
      seterror("Please enter the address");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    const result = await checkBalance();
    if (result === false) {
      notyf.error('Insufficient balance')
      return
    }

    setwaiting(true);

    const provider = new ethers.providers.Web3Provider(ethereum); // Replace with the Infura project ID and network

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      connect.contractAddress,
      Abi.abi,
      signer
    );

    try {
      const transferCoin = contract
        .connect(signer)
        .TransferToken(r, s, a, token, receipent, amount);

      const txId = await transferCoin.wait();
      console.log(txId.hash);
      settrxid("https://testnet.tuber.build/tx/" + txId.transactionHash);

    }
    catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);

  };
  const changedefault = (c: any) => {
    setshow(!show);
    setbyDefault(c.name);
    settoken(c.address);
  };

  const viewtrx = () => {

    if (trxid !== '') {
      window.open(trxid, '_blank')
    }


  }

  return (
    <div className="flex flex-col justify-center items-center space-y-4 ">
      <div
        className="bg-[#fffafa] py-1 w-[100%] hover:shadow-sm rounded-md 
        border-1 border-gray-300 border"
      >
        <input
          // style={{ border: '1px solid red' }}
          className=" text-[0.9rem] font-semibold text-gray-700
       montserrat-subtitle outline-none px-3 py-3  w-[100%]"
          type="text"
          onChange={validatingCr}
          placeholder="Receipent address"
        />
      </div>
      <div
        className="relative flex items-center bg-[#fffafa] py-1 w-[100%] hover:shadow-sm rounded-md 
        border-1 border-gray-300 border"
      >
        <input
          className="text-[0.9rem] font-semibold text-gray-700
        montserrat-subtitle outline-none rounded-md py-3 px-3 w-[100%] "
          value={amount}
          type="text"
          placeholder="Ex: 100 Note"
          onChange={(e) => setamount(e.target.value)}
        />
        {/* Tokens Dropdown Menu */}
        <div className="absolute right-1">
          <ul onClick={() => setshow(!show)}>
            <li
              className="flex p-2 px-3 cursor-pointer
            text-[#10F1B4] font-semibold border-l border-gray-300
            items-center gap-2 hover:text-gray-800 hover:rounded-full hover:bg-[#57ffd2] "
            >
              <p>{byDefault}</p>
              <BsChevronDown color="grey" size={18} />
            </li>
            <div
              className={`
              ${show &&
                `transition-all ease-in bg-white py-1 shadow-md flex flex-col w-[105%] max-h-28 rounded-b-md absolute mt-2
                 scrollbar-thin scrollbar-thumb-[#10F1B4] scrollbar-track-[#b5ffeb] overflow-y-scroll 
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
                    items-center gap-2 hover:text-gray-900 hover:bg-[#8efadd] 
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
        className="flex montserrat-small mx-auto items-center cursor-pointer space-x-1 border-1 p-1 text-white bg-[#10F1B4] 
        hover:shadow-xl px-7 text-center rounded-md font-semibold hover:border-white border-[#10F1B4] border"
        onClick={byDefault === "CANTO" ? Transfer : TransferToken}
      >
        {waiting === false ? (
          "Send"
        ) : (
          <img height={30} width={30} src={sending} alt="" />
        )}
      </button>

      <p onClick={viewtrx} className='montserrat-subtitle  text-gray-500 font-semibold underline underline-offset-8 decoration-[#10F1B4] cursor-pointer'>{trxid !== '' ? trxid.slice(8, 58) : ''}</p>
      <p className='montserrat-subtitle text-[#435864] font-semibold flex mx-auto items-center'>{error}</p>


    </div>
  );
};

export default Transfer;
