import React from 'react';
import logo from '../Logos/White.png';

// from-white to-black text-transparent bg-clip-text

type Props = {}

const Nav = (props: Props) => {
    return (
        <div className='bg-[#02e48a] sm:px-20 px-12 p-5 flex 
        justify-between items-center border-b border-gray-300 '>
            {/* logo left */}
            <div className='flex space-x-1 items-center'>
                <img 
                src={logo}
                alt=''
                className='w-[45px] h-[45px]'
                />
                <h1 className='montserrat-subtitle sm:text-[1.5rem] font-semibold text-[1.2rem] text-white'>Cryptia</h1>
            </div>

            {/* right side */}
            <p className='text-white p-1 px-4 rounded-lg bg-[#02e48a] 
            montserrat-subtitle cursor-pointer hover:text-gray-800 sm:text-[1.2rem] font-semibold'>FAQ</p>

        </div>
    )
}

export default Nav