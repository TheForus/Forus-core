import { useEffect, useMemo, useState } from "react";
import { base58, keccak256 } from "ethers/lib/utils.js";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { useContext } from "react";
import { AppContext } from "./Forus";
// import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { BsChevronDown } from "react-icons/bs";
import { ethers } from "ethers";
import sending from "../Logos/sending.gif";
import { Notyf } from "notyf";
import BigNumber from "bignumber.js";
import { db } from "../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { chainOptions } from "../helper/ChainOptions";
import "notyf/notyf.min.css";
import { BiTransfer } from "react-icons/bi";

const ec = new EllipticCurve.ec("secp256k1");

const Transfer = () => {
  const notyf = new Notyf();
  let currentNetwork: string | any = sessionStorage.getItem("chain");
  let  Abi : any;


  const { validateChain, } = useContext(AppContext);
  const [ContractAddress, setContractAddress] = useState<string | any>("");


  const ERCABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    "function symbol() external view returns (string memory)",
    "function name() external view returns (string memory)",
    "function approve(address owner, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint)",
  ];

  const { ethereum }: any = window;

  let r: string | any;
  let s: string | any;
  let v: string | any;

  const [token, settoken] = useState<string | "">("");
  const [forusKey, setforusKey] = useState<string | "">("");
  const [error, seterror] = useState<string | "">("");
  const [amount, setamount] = useState<string | "">("");
  const [show, setshow] = useState<boolean>(false);
  const [byDefault, setbyDefault] = useState<string>("ETH");
  const [chainList, setchainList] = useState<any>([])
  const [txId, settxID] = useState<string | "">("");


  useMemo(() => {

    chainOptions.map((chain) => {

      if (currentNetwork === chain.name) {
        setbyDefault(chain.currency.symbol);
        settxID(chain.url)
        setContractAddress(chain.contract)
        setchainList(chain.tokens)
      }
      return

    });


  }, []);

  // console.log(chainList, currentNetwork, ContractAddress, sessionStorage.getItem("contractAdd"), txId);

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

    const randomKey = ec.genKeyPair();
    let ephemeralPublic: EC.KeyPair | any = randomKey.getPublic();

    /*
         removing the prefix "fk" of the forus key then decoding it to generate an stealth address
    */

    try {
      if (forusKey.slice(0, 2).toLowerCase() === "fk") {
        const _forusKey = forusKey.slice(2);
        const decodedForusKey = base58.decode(_forusKey);
        const decodedId = decodedForusKey.subarray(0, 33);
        key = ec.keyFromPublic(decodedId, "hex");
      } else { 
        seterror("Plz enter the valid forus key");
      }
    } catch (e: any) {
      seterror(e.message);
    }

    /*
         Generating the stealth address by doing some elliptic curve calculation here
      */

    try {
      const sharedsecret = randomKey.derive(key.getPublic());
      const hashedSecret = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const publicKey =
        key
          ?.getPublic()
          ?.add(hashedSecret.getPublic())
          ?.encode("array", false)
          ?.splice(1) || [];

      const address = keccak256(publicKey);
      const _HexAddress = address.substring(
        address.length - 40,
        address.length
      );

      receipentAddress = "0x" + _HexAddress;

      r = "0x" + ephemeralPublic?.getX().toString(16, 64) || "";
      s = "0x" + ephemeralPublic?.getY().toString(16, 64) || "";
      v =
        "0x" +
        sharedsecret.toArray()[0].toString(16) +
        sharedsecret.toArray()[1].toString(16);

      // console.log(v);
      // console.log(`${v.replace("0x", "")}04${r.slice(2)}${s.slice(2)}`);
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
    const stored = `${v.replace("0x", "")}04${r.slice(2)}${s.slice(2)}`;
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
    validateChain();

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
    const contract = new ethers.Contract(ContractAddress, Abi, signer);
    console.log(r,
      s,
      v,
      receipentAddress,
    )

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


      const trx = await transferCoin;
      trx.wait
      settrxid(txId + trx.hash);

      storing();
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
    console.log(ContractAddress)
    const contract = new ethers.Contract(ContractAddress, Abi, signer);


    try {
      //to send exact amount of tokens are always counted as  amount**18
      const amountParams: any = ethers.utils.parseUnits(amount, 18);
      console.log(amountParams.toString())
      console.log(r,v)
      try {

        // const transferCoin=await contract.transfer(receipentAddress, amountParams);
        const transferERC20 = await contract.TransferToken(
          r,
          s,
          v,
          token,
          receipentAddress,
          amountParams
        );
        const trx = await transferERC20;
        settrxid(txId + trx.hash);
        console.log(receipentAddress)

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
      const res = await contract.allowance(
        msgSender, ContractAddress

      );

      const bigNumber = new BigNumber(res._hex);
      const allowance: string | any = bigNumber.toNumber() / 10 ** 18;
      console.log(res.toString())

      if (allowance < Number(amount)) {
        setButtonState("approving..");
    
        const approvedAmount: any = ethers.utils.parseUnits(amount, 18);
        const approve = await contract.approve(
          ContractAddress,
          approvedAmount 
         
        );
        const txResponse = await approve;
        const tx=txResponse.wait
        console.log(tx)
        setButtonState("Transfer");
        notyf.success("approved");

        setTimeout(() => {
          TransferToken();
        }, 3000);
        
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

    validateChain();

    const provider = new ethers.providers.Web3Provider(ethereum); //
    const contract = new ethers.Contract(token, ERCABI, provider);

    try {
      const balance = await contract.balanceOf(msgSender);
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
    <div className="flex flex-col justify-center items-start space-y-2">
      <div
        className="text-bgGray w-[100%] rounded-md 
       "
      >
        {/* <h2 className="text-[1.3rem] text-left mb-1">Forus Key </h2> */}
        <input
          className="my-4 text-[0.9rem] font-semibold text-gray-400  placeholder:text-gray-500
          montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
           hover:border-cyan-900 w-[100%] bg-[#dedee9] border-2 border-gray-500"
          type="text"
          onChange={validatingForuskey}
          placeholder="Enter Your Forus Key"
        />
      </div>
      {/* Amount */}
      <div className="text-bgGray w-[100%] pb-4 rounded-md">
        {/* <h2 className="text-[1.3rem] text-left mb-1">Amount </h2> */}
        <div
          className="relative flex items-center  py-1 w-[100%] hover:shadow-sm rounded-md         
       "
        >
          <input
            className="text-[0.9rem] font-semibold text-gray-400  placeholder:text-gray-500
          montserrat-subtitle outline-none py-3 px-3 h-[100%] rounded-md
          hover:border-cyan-900 w-[100%] bg-[#dedee9] border-2 border-gray-500"
            value={amount}
            type="text"
            placeholder={`0.1  ${byDefault}`}
            onChange={(e) => setamount(e.target.value)}
          />
          {/* Tokens Dropdown Menu */}
          <div className="min-w-[95px] absolute right-1 ">
            <ul className="" onClick={() => setshow(!show)}>
              <li
                className="flex p-2 px-3 cursor-pointer rounded-md 
 font-semibold border-l border-gray-700
            items-center gap-2 text-cyan-500"
              >
                <p>{byDefault}</p>
                <BsChevronDown size={18} />
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
                {show &&
                  chainList.map((c: any) => (
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
                        <img
                          className=" rounded-lg"
                          src={c.symbol}
                          alt=""
                          height={14}
                          width={18}
                        />
                        <p>{c.name}</p>
                      </li>
                    </div>
                  ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mr-4">
        <button
          onClick={() => {
            const selectedChain = chainOptions.find((chain: any) => chain.currency.symbol === byDefault);
            if (selectedChain) {
              Transfer(); // Call Transfer function if the condition is met
            } else {
              proceed(); // Call proceed function otherwise
            }
          }}
          className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black 
          rounded-md font-bold  transition-all ease-linear"
        >
          {waiting === false ? (
            <>
              <BiTransfer className="text-[1.3rem] text-inherit" />
              <span>{buttonState}</span>
            </>
          ) : (
            'transfering...'
          )}
        </button>
      </div>

      <p
        onClick={viewtrx}
        className="montserrat-subtitle  text-gray-500 font-semibold underline underline-offset-8 decoration-bgGray cursor-pointer"
      >
        {trxid !== "" ? trxid.slice(8, 58) : ""}
      </p>
      <p className="montserrat-subtitle text-gray-600 font-semibold flex mx-auto items-center">
        {error}
      </p>
    </div>
  );
};

export default Transfer;
