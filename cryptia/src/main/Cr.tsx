import { Crc } from "../helper/Crc";
import base58 from 'bs58';
import { useState, useEffect } from 'react'
import EllipticCurve from 'elliptic';
import { AiOutlineCopy } from "react-icons/ai";
const ec = new EllipticCurve.ec('secp256k1');

type Props = {}


const Cr = (props: Props) => {

  const [cryptiaaddress, setcryptiaaddress] = useState<string | any>('')
  const [, setstoredsecretkey] = useState<string | any>('')
  const [note, setnote] = useState<boolean>(false)


  const Generate = () => {

    try {

      let key = ec.genKeyPair();

      const skey: void = localStorage.setItem('secretKey', key.getPrivate().toString(16));
      const secretKey = ec.keyFromPrivate(key.getPrivate().toString(16), 'hex');
      setstoredsecretkey(skey)


      const pub = Uint8Array.from(
        secretKey.getPublic().encodeCompressed('array')
      );

      const crc = Crc(pub);
      const enc: Uint8Array = new Uint8Array(pub.length + 2);
      enc.set(pub);
      enc.set(crc, pub.length);
      const C: string = 'C' + base58.encode(enc);
      localStorage.setItem('Cr', C);
      setcryptiaaddress(C);
    }

    catch (e) {
      console.error(e);

    }

  }

  useEffect(() => {
    Generate();
  }, []);


  const downloadTxt = (text: any) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "secretKey.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  const reveal = () => {

    setnote(true)
    setTimeout(() => {
      setnote(false)

    }, 7000);


  }


  const copy = () => {
    navigator.clipboard.writeText(cryptiaaddress)
    downloadTxt(localStorage.getItem('secretKey'))
    reveal()

  }



  return (
    <>
      <div className="bg-white flex flex-col items-center p-4 rounded-t-md">

        <div className="pb-6 flex flex-col space-y-4 items-center border-b w-full">
        <h1 
        className="mx-auto w-[70%] montserrat-subtitle text-gray-700 md:text-3xl 
        text-2xl  font-bold"
        > Unlock the 
        <span className="montserrat-subtitle md:text-3xl 
        text-2xl font-extrabold text-[#10F1B4]"> power of secrecy</span> with Cryptia,</h1>
        
        {note === true &&
          <p 
          className="montserrat-small font-mono w-[80%]">
          Guard the key, unleash the cr. Never reveal the 'secret key' , only share your secure 'Cr encess' for confidential transactions. </p>}
          </div>

        <div className="my-6 flex gap-4 items-center p-2 px-3 rounded-md bg-gray-100">
          <p className="montserrat-small font-medium">
            <span className="text-gray-800 font-semibold">#Cryptia</span> 
            - #{cryptiaaddress}</p>
          <AiOutlineCopy className='font-bold text-2xl' onClick={copy} />
        </div>

        <button 
        className="mb-4 montserrat-subtitle border-1 p-1 montserrat-subtitle  
        text-black bg-[#10F1B4] hover:shadow-xl px-6 text-center 
        rounded-md  font-semibold   hover:bg-gray-800 
        hover:text-[#10F1B4]  hover:border-white border-gray-200 border" 
        onClick={Generate}>Generate</button>
      </div>
    </>
  )
}

export default Cr