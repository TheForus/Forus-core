import React from 'react'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';


const Footer = () => {
  return (
    <div >
      <ul >
        <li ><a href="/https://discord.gg/qupF3BrP"><FaDiscord  size={24} /></a></li>
        <li ><a href="https://github.com/ScriptKiddii/Cloak"><FaGithub size={24} /></a></li>
        <li ><a href="https://twitter.com/TronCloak"><FaTwitter size={24} /></a></li>
      </ul>
    </div>
  )
}

export default Footer