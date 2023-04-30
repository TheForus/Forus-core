import { useState } from 'react'
import { base58, keccak256, getAddress } from 'ethers/lib/utils.js';
import EllipticCurve from 'elliptic';
import { ec as EC } from 'elliptic';
import { useContext } from 'react';
import { AppContext } from './Cryptia';
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
const ec = new EllipticCurve.ec('secp256k1');




const Transfer = () => {

  const connect = useContext(AppContext)



  let r: string | any;
  let s: string | any;
  let a: string | any;

  let receipent: string | any;

  let ethers: any;

  const contractAddress = '0x6340e1ed7DCe39ccA016C1805286Aa11536b4F3a'
  const { ethereum }: any = window;

  const [token, settoken] = useState('')
  const [CrMetaAddress, setCrMetaAddress] = useState('CNQ3HKdeSDpxpZCDGTESp4Ecy8s9BVLNoPg8QvymjftEQN3b')
  const [error, seterror] = useState('')
  const [amount, setamount] = useState('')
  const [show, setshow] = useState(false)
  const [bydefault, setbydefault] = useState('TRX')
  const [trxid, settrxid] = useState('')
  const [running, setrunning] = useState(false)




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
        seterror('Plz paste the valid address');
        console.log('error')
      }
    } catch (e: any) {
      seterror(e.message);
    }
    // 
    try {
      const sharedsecret = ephKey.derive(meta.getPublic());
      const hashed = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      a = '0x' + sharedsecret.toArray()[0].toString(16).padStart(2, '0');
      const publicKey = meta?.getPublic()?.add(hashed.getPublic())?.encode('array', false)?.splice(1) || [];
      const address = keccak256(publicKey);
      const _HexString = address.substring(address.length - 40, address.length);
      receipent = getAddress('0x' + _HexString)
      console.log(receipent)


      r = '0x' + ephPublic?.getX().toString(16, 64) || '';
      s = '0x' + ephPublic?.getY().toString(16, 64) || '';

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


    const provider = new ethers.providers.JsonRpcProvider(ethereum); // Replace with the Infura project ID and network
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const contractMethod = contract.connect(signer).trasnferCoin(r, s, a, receipent); // Replace methodName with the desired method
      const value = ethers.utils.parseEther(amount); // Replace '0.1' with the desired amount of ether to send
      const trx = await contractMethod({ value: value }); // Pass the value property in the transaction object
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



    const provider = new ethers.providers.JsonRpcProvider(ethereum); // Replace with the Infura project ID and network

    const signer = provider.getSigner();


    const contract = new ethers.Contract(contractAddress, abi, signer);

    const trx = await contract.trasnferCoin(r, s, a, token, receipent, amount).send({
      value: ethers.utils.parseEther(amount)
    });

    const txId = await trx.wait();
    console.log(txId);
    settrxid('https://testnet.tuber.build/' + txId.transactionHash);

    setrunning(false);
  };


  return (
    <div>Transfer

      <button onClick={setUp}>Initalize</button>
    </div>
  )
}

export default Transfer