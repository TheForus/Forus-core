import React from 'react'
import { useNavigate } from 'react-router-dom'


const Header = () => {

  const navigate = useNavigate()
  return (

    <>
    
      <div>

        {/* left side */}

        <h1>CryptiaProtocol</h1>
        <p>Unlock the Power of Secure and Private Transactions with Cryptia!</p>
        <button onClick={()=>navigate('/Cryptia')}>Launch</button>


        {/* right Banner */}
        <img src='' alt=''/>

      </div>

    </>


  )
}

export default Header