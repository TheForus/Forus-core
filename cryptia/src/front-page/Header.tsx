import React from 'react'
import { useNavigate } from 'react-router-dom'
import workflow from '../Logos/work.png'


const Header = () => {

  const navigate = useNavigate()
  return (

    <>

      <div className='bg-[#02e48a] sm:px-20 px-12 p-10 py-12 flex justify-between' >

        {/* left side */}
        <div className='flex flex-col items-start space-y-6 mt-6'>
          <h2 className='montserrat-subtitle font-bold sm:text-[2.0rem] text-[2.4rem] text-[white]'>Security and Anonymity</h2>
          <p className='montserrat-small font-semibold text-[#4b6d5c] text-left break-words  max-w-[400px] text-[1.1rem]'>Unlock the Power of Secure and Private Transactions with Cryptia!
            Safeguard Your Financial Interactions with Cutting-edge Cryptography.!</p>
          <button
            className='border-1 hover:text-white hover:bg-[black] 
        hover:shadow-xl p-1 px-9 rounded-lg bg-[#ffffff] text-[#06FC99] 
        font-semibold hover:border-white border text-xl'
            onClick={() => navigate('/Cryptia')}
          >Launch</button>
        </div>

        {/* right Banner */}
        <img src={workflow} alt='' height={150} width={710}  />

      </div>

    </>


  )
}

export default Header