import React from 'react'
import { useNavigate } from 'react-router-dom'
import workflow from '../Logos/work.png'


const Header = () => {

  const navigate = useNavigate()
  return (

    <>


      <div className='bg-[#A8D4D1] sm:px-20 px-12 p-10   flex justify-between ' >

        {/* left side */}
        <div className='flex flex-col items-start space-y-6 mt-12'>
          <h2 className='montserrat-subtitle font-bold sm:text-[2.0rem] text-[2.4rem] text-[white]'>Stay anonymous & secure</h2>
          <p className='montserrat-small font-semibold text-[#58707e] text-left break-words  max-w-[400px] text-[1.1rem]'>Unlock the Power of Secure and Private Transactions with Cryptia!
            Safeguard Your Financial Interactions with Cutting-edge Cryptography.!</p>
          <button
            className='border-1 hover:text-white hover:bg-[black] 
        hover:shadow-xl p-1 px-9 rounded-lg bg-[#E8FDF4] text-[#A8D4D1] 
        font-semibold hover:border-white border text-xl'
            onClick={() => navigate('/Cryptia')}
          >Launch</button>
        </div>

        {/* right Banner */}
        <div > <img className=' border-1 rounded-lg ' src={workflow} alt='' height={120} width={650} /></div>


      </div>

    </>


  )
}

export default Header