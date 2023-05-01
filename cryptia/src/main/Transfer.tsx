import { useState } from 'react'
import { base58, keccak256, getAddress } from 'ethers/lib/utils.js';
import EllipticCurve from 'elliptic';
import { ec as EC } from 'elliptic';
import { useContext } from 'react';
import { AppContext } from './Cryptia';
import Abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { Crypto } from '../helper/Crypto';
import { AiOutlineArrowDown } from "react-icons/ai";
import { ethers } from 'ethers'
const ec = new EllipticCurve.ec('secp256k1');




const Transfer = () => {


  const connect = useContext(AppContext)





  let r: string | null;
  let s: string | null;
  let a: string | null;



  // let ethers: any;

  // const contractAddress = '0x6340e1ed7DCe39ccA016C1805286Aa11536b4F3a'
  const { ethereum }: any = window;

  const [token, settoken] = useState<string | ''>('');
  const [CrMetaAddress, setCrMetaAddress] = useState<string | ''>('');
  const [error, seterror] = useState<string | ''>('');
  const [amount, setamount] = useState<string | ''>('');
  const [show, setshow] = useState<boolean>(false);
  const [byDefault, setbyDefault] = useState<string>('CANTO');
  const [trxid, settrxid] = useState<string>('');
  const [running, setrunning] = useState<boolean>(false);

  let receipent: string | '';



  const validatingCr = (event: any) => {

    if (event.target.value[0] !== 'T' && event.target.value !== '') {
      seterror('Invalid address')
      setTimeout(() => {
        seterror('')
      }, 4000);

    }

    setCrMetaAddress(event.target.value)
  }

  const setUp = async () => {

    let meta: EC.KeyPair | any;
    let ephPublic: EC.KeyPair | any;
    let receipent: string | null;

    const ephKey = ec.genKeyPair();
    ephPublic = ephKey.getPublic();


    try {
      if (CrMetaAddress.startsWith('C')) {
        const _CrMetaAddress = CrMetaAddress.slice(1);
        const decoded = base58.decode(_CrMetaAddress);
        const decodedId = decoded.subarray(0, 33);
        meta = ec.keyFromPublic(decodedId, 'hex');
        // console.log(meta)
      } else {
        seterror('Plz enter the valid  cr address');
      }
    } catch (e: any) {
      seterror(e.message);
    }
    // 
    try {
      const sharedsecret = ephKey.derive(meta.getPublic());
      const hashed = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const publicKey = meta?.getPublic()?.add(hashed.getPublic())?.encode('array', false)?.splice(1) || [];
      const address = keccak256(publicKey);
      const _HexString = address.substring(address.length - 40, address.length);
       receipent = getAddress('0x' + _HexString)



      r = '0x' + ephPublic?.getX().toString(16, 64) || '';
      s = '0x' + ephPublic?.getY().toString(16, 64) || '';
      a = '0x' + sharedsecret.toArray()[0].toString(16).padStart(2, '0');

    } catch (e) {
      console.log('error', e);
    }

    return true;



  }

  const Transfer = async () => {
    if (!ethereum) {
      alert('Please initialize MetaMask');
      return;
    }

    setUp()

    if (CrMetaAddress === '' || amount === '') {
      seterror('Please enter the cr address');
      console.log(error)
      setTimeout(() => {
        seterror('');
      }, 4000);
      return;
    }

    setrunning(true);


    const provider = new ethers.providers.Web3Provider(ethereum); // Replace with the Infura project ID and network
    const signer = provider.getSigner();
    console.log(signer)
    const contract = new ethers.Contract(connect.contractAddress, Abi.abi, signer);
    console.log(connect.contractAddress, amount)

    try {

      const valueToSend = ethers.utils.parseEther(amount);
      const transactionParameters = {
        value: valueToSend,
      };
      console.log('r', receipent)
      const transferCoin = await contract.TransferCoin(r, s, a, receipent, transactionParameters); // Replace methodName with the desired method

      const trx = await transferCoin(); // Pass the value property in the transaction object
      const txId = await trx.wait();
      settrxid('https://testnet.tuber.build/' + txId.transactionHash);

      setrunning(false);

    }

    catch (e) {
      console.log(e);
      setrunning(false);
    }

  };




  const TransferToken = async () => {
    if (!ethereum) {
      alert('Please initialize MetaMask');
      return;
    }

    if (connect.chainid !== '0x1e15') {
      alert('Please connect to canto testnet');
      return;
    }

    if (CrMetaAddress === '' || amount === '') {
      seterror('Please enter the address');
      setTimeout(() => {
        seterror('');
      }, 4000);
      return;
    }

    setrunning(true);





    const provider = new ethers.providers.Web3Provider(ethereum);  // Replace with the Infura project ID and network

    const signer = provider.getSigner();


    const contract = new ethers.Contract(connect.contractAddress, Abi.abi, signer);

    const transferCoin = contract.connect(signer).TransferToken(r, s, a, token, receipent, amount); // Replace methodName with the desired method

    const trx = await transferCoin(); // Pass the value property in the transaction object


    const txId = await trx.wait();
    console.log(txId);
    settrxid('https://testnet.tuber.build/' + txId.transactionHash);

    setrunning(false);
  };
  const changedefault = (c: any) => {
    setshow(!show)
    setbyDefault(c.name)
    settoken(c.address)

  }

  return (
    <div>
      <input
        // style={{ border: '1px solid red' }}
        className="bg-[#fffafa] font-semibold text-gray-700 montserrat-subtitle outline-none border rounded-md p-1 px-2 border-1 border-gray-400 w-[210px]"
        type="text"
        onChange={validatingCr}
        placeholder="Receipent address"
      />

      <div className=' flex justify-center items-center'>
        <input
          className="bg-[#fffafa] font-semibold text-gray-700 montserrat-subtitle outline-none border rounded-md p-1 px-2 border-1 border-gray-400 w-[110px]"
          value={amount}
          type="text"
          placeholder="Ex: 100trx"
          onChange={(e) => setamount(e.target.value)}
        />
        <div >
          <ul onClick={() => setshow(!show)}>
            <li className='border-4 rounded  border-green-700'>
              <p>{byDefault}</p>
              <AiOutlineArrowDown color='grey' size={18} />
            </li>
            <div>
              {show && Crypto.map((c) => (
                <div>
                  <li key={c.name} onClick={() => changedefault(c)}>
                    <p>{c.name}</p>
                    <img src={c.symbol} alt="" height={16} width={20} />
                  </li>
                </div>
              ))}
            </div>
          </ul>
        </div>

      </div>
      <button className='border-2 border-black ' onClick={Transfer}>Send</button>
    </div>
  )
}

export default Transfer