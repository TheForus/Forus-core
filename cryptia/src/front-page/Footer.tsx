import React from 'react'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';


const Footer = () => {
  return (
    <div className='flex p-10 w-full bg-[#ECFFFA]'>
      <ul className='flex space-x-8 items-center m-auto'>
        <li className='hover:text-[#02E48A]'><a href="/https://discord.gg/qupF3BrP"><FaDiscord  size={24} /></a></li>
        <li className='hover:text-[#02E48A]'><a href="https://github.com/ScriptKiddii/Cloak"><FaGithub size={24} /></a></li>
        <li className='hover:text-[#02E48A]'><a href="https://twitter.com/TronCloak"><FaTwitter size={24} /></a></li>
      </ul>
    </div>
  )
}

export default Footer