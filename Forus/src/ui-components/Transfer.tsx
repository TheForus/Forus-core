import { useEffect, useMemo, useState } from "react";
import { base58, keccak256 } from "ethers/lib/utils.js";
import EllipticCurve from "elliptic";
import { ec as EC } from "elliptic";
import { useContext } from "react";
import { AppContext } from "./Container";
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { BsChevronDown } from "react-icons/bs";
import { db } from "../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { ethers } from "ethers";
import { Notyf } from "notyf";
import BigNumber from "bignumber.js";
import { chainOptions } from "../helpers/ChainOptions";
import "notyf/notyf.min.css";
import { BiTransfer } from "react-icons/bi";
import { ERC20ABI } from "../helpers/ERC20ABI";
import { isDetected } from "../checkers/isDetected";


const ec = new EllipticCurve.ec("secp256k1");

const Transfer = () => {

  const notyf = new Notyf();

  let currentNetwork: string | any = sessionStorage.getItem("chain");



  const { accountChecker } = useContext(AppContext);
  const [ContractAddress, setContractAddress] = useState<string | any>("");




  const { ethereum }: any = window;


  let x_cor: string | '';
  let y_cor: string | '';
  let sharedSecret: string | '';

  const [token, settoken] = useState<string | "">("");
  const [forusKey, setforusKey] = useState<string | "">("");
  const [error, seterror] = useState<string | "">("");
  const [amount, setamount] = useState<string | "">("");
  const [show, setshow] = useState<boolean>(false);
  const [byDefault, setbyDefault] = useState<string>("ETH");
  const [chainList, setchainList] = useState<any>([])
  const [txId, settxID] = useState<string | "">("");


  const msgSender = useMemo(() => {

    return sessionStorage.getItem("address");

  }, [])


  const provider = useMemo(() => {

    return new ethers.providers.Web3Provider(ethereum);

  }, [])


  var receipentAddress: string;


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
  const [buttonState, setButtonState] = useState<string>(
    !sessionStorage.getItem("address") ? "Connect Wallet" : "Transfer"
  );




  //helpers functuion to validate forus key


  const validatingForuskey = (event: any) => {

    const key = event.target.value;

    if (key !== '') {
      if (
        (key.slice(0, 2).toLowerCase() !== "fk" && (key.length > 49 || key.length < 49))) {
        seterror("Invalid address");
        setTimeout(() => {
          seterror("");
        }, 600);
      }
    }


    setforusKey(key);

  };

  const validateInputs = () => {

    if (forusKey === "" || amount === "") {
      seterror("Please fill the inputs");
      setTimeout(() => {
        seterror("");
      }, 3000);
      return;
    }
  }





  //receipent public key (i.e forus key )
  let rec_fkey: EC.KeyPair | any;



  //ec keypair use to generate private numbers and public stealth address
  let keypair: EC.KeyPair = ec.genKeyPair();

  //one time ephemeral public key to be published in logs directory contract

  let ephemeralPkey: any = keypair.getPublic();





  const validateForusKey = async () => {

    /*
       removing the prefix "fk" of the forus key 
  */


    try {
      if (forusKey.slice(0, 2).toLowerCase() === "fk") {
        const _forusKey = forusKey.slice(2);

        /*
         removing the one bytes suffix from the forus key then decoding it to generate an stealth address
    */
        let decode_forusKey = base58.decode(_forusKey);

        const decodedkey = decode_forusKey.subarray(0, 33);
        rec_fkey = ec.keyFromPublic(decodedkey, "hex");

      } else {
        seterror("Invalid key");
      }
    } catch (e: any) {
      seterror(e.message);
    }
  }
  const setUpStealthAddress = async () => {


    validateForusKey()
    /*
         Generating the stealth address by doing some elliptic curve calculation here
      */

    try {
      const calculateSecret = keypair.derive(rec_fkey.getPublic());
      const hashedSecret = ec.keyFromPrivate(keccak256(calculateSecret.toArray()));
      const publicKey = rec_fkey?.getPublic()?.add(hashedSecret.getPublic())?.encode("array", false);

      //P = H(r*A) * G + B

      //generating wallet address from public key

      const _publicKey = publicKey?.splice(1) || []

      const address = keccak256(_publicKey);

      const _HexAddress = address.slice(-40);

      receipentAddress = "0x" + _HexAddress;


      //x and y co-ordinate of ephemeral public key
      x_cor = "0x" + ephemeralPkey?.getX().toString(16, 64) || "";
      y_cor = "0x" + ephemeralPkey?.getY().toString(16, 64) || "";

      // 2byets shared secret prefixed with ephemeral public key

      sharedSecret = "0x" + calculateSecret.toArray()[0].toString(16) + calculateSecret.toArray()[1].toString(16);

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
    const stored = `${sharedSecret.replace("0x", "")}04${x_cor.slice(2)}${y_cor.slice(2)}`;
    try {
      await addDoc(logs, {
        Keys: stored,
      });
    } catch (err) {
      console.error(err);
    }
    console.log("storing...", stored);
  };


  const Transfer = async () => {

    if (sessionStorage.getItem("address") === null) accountChecker()

    //

    setUpStealthAddress();

    //

    validateInputs();

    setwaiting(true);


    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, Abi.abi, signer);
    console.log(ContractAddress)

    console.log(receipentAddress,)


    try {
      const valueToSend = ethers.utils.parseEther(amount);
      const transactionParameters = {
        value: valueToSend,
      };


      const transfer = await contract.Transfer(
        x_cor,
        y_cor,
        sharedSecret,
        receipentAddress,
        transactionParameters
      );
 

      const trx = await transfer;
      // await trx.wait

      settrxid(txId + trx.hash);


      // setamount("");
      // setforusKey("");

      //storing public keys in logs

      storing()


    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };





  // const signing = async () => {

  //   // const provider = new ethers.providers.Web3Provider(ethereum);
  //   const signer = provider.getSigner();


  //   const relayer = new ethers.Wallet("", provider);
  //   const message = "Hello, World!";
  //   const messageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));

  //   // Sign the message
  //   const signedTransaction = await signer.signMessage(ethers.utils.arrayify(messageHash));
  //   const { v, r, s } = ethers.utils.splitSignature(signedTransaction);
  //   const signature = ethers.utils.joinSignature({ r, s, v });
  //   console.log(v, r, s);

  //   const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.arrayify(messageHash), signedTransaction);

  //   console.log('Original Address:', await signer.getAddress());
  //   console.log('Recovered Address:', recoveredAddress);


  //   const tx = {
  //     to: relayer.address,
  //     data: signedTransaction,
  //     value: ethers.utils.parseEther('0.0001'),
  //   }


  //   const txResponse = await relayer.sendTransaction(tx);


  //   // const signature = ethers.utils.joinSignature({ r, s, v });

  //   // Recover the public key

  //   const publicKey = ethers.utils.recoverPublicKey(txResponse.hash, signedTransaction);


  //   // Derive the Ethereum address from the public key
  //   const address = ethers.utils.computeAddress(publicKey);

  //   console.log('Recovered Address:', address);
  //   console.log('hash', txResponse.hash);


  //   settrxid(txId + txResponse.hash)
  // }



  const TransferToken = async () => {

    //

    setUpStealthAddress();

    //

    validateInputs()

    setwaiting(true);



    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, Abi.abi, signer);


    try {

      //to send exact amount of tokens are always counted as  amount**18
      const amountParams: any = ethers.utils.parseUnits(amount, 18);


      try {
        const transferERC20 = await contract.TransferERC20(
          x_cor,
          y_cor,
          sharedSecret,
          token,
          receipentAddress,
          amountParams
        );

        const trx = await transferERC20;
        await trx.wait

        settrxid(txId + trx.hash);


      } catch (err: any) {
        console.log(err.message);
        seterror(err.message);
      }

      //storing in db

      storing()

    } catch (e: any) {
      console.log(e);
      seterror(e.message);
    }
    setwaiting(false);
  };

  async function approve() {

    const signer = provider.getSigner();
    const contract = new ethers.Contract(token, ERC20ABI, signer);


    try {
      const allowance = await contract.allowance(
        msgSender, ContractAddress

      );

      const bigNumber = new BigNumber(allowance._hex);
      const _allowance: number = bigNumber.toNumber() / 10 ** 18;


      if (_allowance < Number(amount)) {

        const approvedAmount: any = ethers.utils.parseUnits(amount, 18);
        const approve = await contract.approve(
          ContractAddress,
          approvedAmount

        );
        setButtonState("Approving..");

        const txResponse = await approve;
        await txResponse.wait
        console.log(txResponse)


        setButtonState("Transfer");

        notyf.success("Approved");

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


    //checking is ethereum connected

    isDetected()

    // validateChain();

    const contract = new ethers.Contract(token, ERC20ABI, provider);

    try {
      const balance = await contract.balanceOf(msgSender);
      const bigNumber = new BigNumber(balance._hex);

      const erc20Balance: any = bigNumber.toNumber() / 10 ** 18;

      if (erc20Balance >= amount) {
        approve();

      } else {
        notyf.error("insufficient token balance");
      }
    } catch (err: any) {

      console.log(err.message);
      seterror(err.message);
    }
  }

  const changedefaultval = (c: any) => {
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

        <input
          className="my-4 text-[0.9rem] font-semibold text-gray-300  placeholder:text-gray-500
          montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
           hover:border-cyan-900 w-[100%] bg-black/10 border-2 border-gray-600"
          type="text"
          onChange={validatingForuskey}
          placeholder="Enter Your Forus Key"
        />
      </div>
      {/* Amount */}
      <div className="text-bgGray w-[100%] pb-4 rounded-md">

        <div
          className="relative flex items-center  py-1 w-[100%] hover:shadow-sm rounded-md         
       "
        >
          <input
            className="text-[0.9rem] font-semibold text-gray-300  placeholder:text-gray-500
          montserrat-subtitle outline-none py-3 px-3 h-[100%] rounded-md
          hover:border-cyan-900 w-[100%] bg-black/10 border-2 border-gray-600"
            value={amount}
            type="text"
            placeholder={`0.1  ${byDefault}`}
            onChange={(e) => setamount(e.target.value)}
          />
          {/* Tokens Dropdown Menu */}
          <div className="min-w-[95px] absolute right-1 ">
            <ul className="" onClick={() => setshow(!show)}>
              <li
                className="flex p-2 px-3 cursor-pointer rounded-md  font-semibold border-l border-gray-700
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
                        onClick={() => changedefaultval(c)}
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
          className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle  py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight 
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
      {/* <button className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle  py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight 
          rounded-md font-bold  transition-all ease-linear" onClick={signing}>
        sign  </button> */}

    </div>
  )
};

export default Transfer;
