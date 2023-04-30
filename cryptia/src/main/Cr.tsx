import { Crc } from "../helper/Crc";
import base58 from 'bs58';
import { useState, useEffect } from 'react'
import EllipticCurve from 'elliptic';
import { AiOutlineCopy } from "react-icons/ai";
const ec = new EllipticCurve.ec('secp256k1');

type Props = {}

const Cr = (props: Props) => {

  const [cryptiaencess, setcryptiaencess] = useState<string | any>('')
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
      setcryptiaencess(C);
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
    navigator.clipboard.writeText(cryptiaencess)
    downloadTxt(localStorage.getItem('secretKey'))
    reveal()

  }



  return (
    <>
      <div>

        <h1> Unlock the power of secrecy with Cryptia,</h1>
        {note === true && 
        <p>Guard the key, unleash the cr. Never reveal the 'secret key' , only share your secure 'Cr encess' for confidential transactions. </p>}


        <div>
          <p>{cryptiaencess}</p>
          <AiOutlineCopy onClick={copy} />
        </div>

        <button onClick={Generate}>Generate</button>

      </div>
    </>
  )
}

export default Cr