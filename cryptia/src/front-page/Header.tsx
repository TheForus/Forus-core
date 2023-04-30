import React from 'react'
import { useNavigate } from 'react-router-dom'


const Header = () => {

  const navigate = useNavigate()
  return (

    <>
    
    <div className='bg-[#02e48a] sm:px-20 px-12 p-10 py-20 flex justify-between'>

        {/* left side */}
        <div className='flex flex-col items-start space-y-6'>
        <h2 className='montserrat-subtitle font-bold sm:text-[1.9rem] text-[1.7rem] text-[white]'>CryptiaProtocol</h2>
        <p className='montserrat-small font-semibold text-[#254233] text-left break-words  max-w-[400px]'>Unlock the Power of Secure and Private Transactions with Cryptia!</p>
        <button
        className='border-1 hover:text-white hover:bg-[black] 
        hover:shadow-xl p-1 px-6 rounded-lg bg-[#ffffff] text-[#006d41] 
        font-semibold hover:border-white border text-lg' 
        onClick={()=>navigate('/Cryptia')}
        >Launch</button>
        </div>

        {/* right Banner */}
        <img src='' alt=''/>

      </div>

    </>


  )
}

export default Header