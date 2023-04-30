import { useState, useEffect } from 'react'
import { keccak256 } from 'ethers/lib/utils.js';
import EllipticCurve from 'elliptic';
import { ec as EC } from 'elliptic';
const ec = new EllipticCurve.ec('secp256k1');




const Accept = () => {

  const [rootsecretkey, setrootsecretkey] = useState('')
  const [privatekey, setprivatekey] = useState('')
  const [hide, sethide] = useState(true)
  const [matching, setmatchingkey] = useState(false)
  const [err, seterr] = useState(false)
  const [reveal, setreveal] = useState(false)
  const [founded, setfounded] = useState('founded')
  const [iscopied, setiscopied] = useState('Copy PrivateKey')
  let zkeys = []


  
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

    // const ephkeys = localStorage.getItem('ephkeys');
    // const registry = JSON.parse(ephkeys);
    // console.log(registry)

    // registry.forEach((z : any) => {

    //   ephPublicKey = ec.keyFromPublic(z.slice(3), 'hex');
    //   RSharedsecret = secretkey.derive(ephPublicKey.getPublic()); // 
    //   RHashedsecret = ec.keyFromPrivate(keccak256(RSharedsecret.toArray()));
    //   _sharedSecret = '0x' + RSharedsecret.toArray()[0].toString(16).padStart(2, '0')
    //   // console.log(z.slice(1, 3).toString() , _sharedSecret.toString().slice(2, 4))


    //   try {
    //     if (_sharedSecret.toString().slice(2, 4) === z.slice(1, 3).toString()) {
    //       const _key = secretkey.getPrivate().add(RHashedsecret.getPrivate());
    //       const pk = _key.mod(ec.curve.n);
    //       console.log('Private key to open wallet', pk.toString(16, 32))
    //       setprivatekey(pk.toString(16, 32))
    //       setreveal(true)
    //       setrootsecretkey('')
    //       setfounded('founded')

    //     }
    //     return

    //   }

    //   catch (e : any) {
    //     seterr(e.message)
    //   }


    // })
    // setmatchingkey(false)


  }


    return (
      <div>Accept</div>
    )
  }

  export default Accept