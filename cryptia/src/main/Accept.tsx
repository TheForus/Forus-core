import { useState, useEffect } from 'react'
import { keccak256 } from 'ethers/lib/utils.js';
import EllipticCurve from 'elliptic';
import { ec as EC } from 'elliptic';
import abi from "../artifacts/contracts/Logs.sol/Logs.json";
import { useContext } from 'react';
import { AppContext } from './Cryptia';
import { AiOutlineCopy } from "react-icons/ai";
// import { GiKangaroo } from "react-icons/gi";
import { AiOutlineArrowsAlt, AiOutlineShrink } from "react-icons/ai";
const ec = new EllipticCurve.ec('secp256k1');




const Accept = () => {
  const connect = useContext(AppContext)

  const [rootsecretkey, setrootsecretkey] = useState('')
  const [privatekey, setprivatekey] = useState('')
  const [hide, sethide] = useState(true)
  const [matching, setmatchingkey] = useState(false)
  const [err, seterr] = useState(false)
  const [reveal, setreveal] = useState(false)
  const [founded, setfounded] = useState('founded')
  const [iscopied, setiscopied] = useState('Copy PrivateKey')

  let zkeys: any[] = []
  let ethers: any;

  const { ethereum }: any = window;

  useEffect(() => {

    const fetchData = async () => {
      try {


        const provider = new ethers.providers.JsonRpcProvider(ethereum); // Replace with the Infura project ID and network
        const contract = new ethers.Contract(connect.contractAddress, abi, provider);

        const limit = await contract.getLimit();
        console.log(limit.toString())

        for (let i = 0; i < limit.toString(); i++) {
          let result: any = await contract.logs(i)
          zkeys.push(`C${result.ss.replace('0x', '')}04${result.x.slice(2)}${result.y.slice(2)}`)
          localStorage.setItem('ephLogs', JSON.stringify(zkeys))



        }


      } catch (e) {
        console.error(e);
      }
    }
    fetchData();


  }, []);

  const generateprivatekey = (): void => {

    const { ethereum }: any = window
    if (!ethereum) {
      return
    }
    setmatchingkey(true)

    var secretkey: EC.KeyPair | any;
    let skey: any = localStorage.getItem('secretKey')
    if (rootsecretkey === '') {
      secretkey = ec.keyFromPrivate(skey, 'hex');

    }

    else {
      secretkey = ec.keyFromPrivate(rootsecretkey, 'hex');
    }

    var ephPublicKey;
    var RSharedsecret;
    var RHashedsecret;
    var _sharedSecret;

    const ephLogs : string[] | any= localStorage.getItem('ephLogs');
    const data = JSON.parse(ephLogs);
    console.log(data)

    data.forEach((z: any) => {

      ephPublicKey = ec.keyFromPublic(z.slice(3), 'hex');
      RSharedsecret = secretkey.derive(ephPublicKey.getPublic()); // 
      RHashedsecret = ec.keyFromPrivate(keccak256(RSharedsecret.toArray()));
      _sharedSecret = '0x' + RSharedsecret.toArray()[0].toString(16).padStart(2, '0')
      // console.log(z.slice(1, 3).toString() , _sharedSecret.toString().slice(2, 4))


      try {
        if (_sharedSecret.toString().slice(2, 4) === z.slice(1, 3).toString()) {
          const _key = secretkey.getPrivate().add(RHashedsecret.getPrivate());
          const pk = _key.mod(ec.curve.n);
          console.log('Private key to open wallet', pk.toString(16, 32))
          setprivatekey(pk.toString(16, 32))
          setreveal(true)
          setrootsecretkey('')
          setfounded('founded')

        }
        return

      }

      catch (e: any) {
        seterr(e.message)
      }


    })
    setmatchingkey(false)


  }

  const copykey = () => {
    navigator.clipboard.writeText(privatekey)
    setiscopied('Copied')
  }


  return (
    <>
    <div className="py-2 flex space-x-4 justify-center ml-11">
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
        <p className="text-gray-500 p-1 px-2 font-semibold montserrat-small ">
          Expand to enter the saved Key ( optional )
        </p>
      )}
      {/* expand icon (toggle of input button) */}
      {hide ? (
        <AiOutlineArrowsAlt
          className="cursor-pointer text-gray-500"
          size={25}
          onClick={() => sethide(!hide)}
        />
      ) : (
        <AiOutlineShrink
          className="cursor-pointer text-gray-500"
          size={25}
          onClick={() => sethide(!hide)}
        />
      )}
    </div>

    {/* Match key */}
    <div className="flex justify-center pt-4">
      <div
        className="flex items-center cursor-pointer space-x-1 border-1 p-1 text-white bg-[#10F1B4] hover:shadow-xl px-6 text-center rounded-md hover:bg-[#FDF0EF] hover:text-[#10F1B4] font-semibold hover:border-white border-[#10F1B4] border"
        onClick={generateprivatekey }
      >
        {/* <GiKangaroo size={26} /> */}
        <h2 className='montserrat-small'>Match Key</h2>
      </div>
    </div>

    {/* message */}
    <div className="p-4  text-[#10F1B4]  font-semibold">
      {matching === true ? <p>Running.....</p> : false}
      {reveal === true ? (
        <div className="flex ml-60  justify-center space-x-3 montserrat-small">
          <p>{iscopied}</p>
          <AiOutlineCopy size={25} className='cursor-pointer text-gray-500 ' onClick={copykey} />
        </div>
      ) : (
        <>
          <p>{founded !== 'founded' && 'Key doesnt exist'}</p>
          <p>{err && 'Error : ' + err}</p>
        </>
      )}
    </div>




  </>
  )
}

export default Accept