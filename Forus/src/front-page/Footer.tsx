import React from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex p-10 w-full bg-[#e9e9f3] ">
      <ul className="flex space-x-8 items-center m-auto">
        <li className="text-[#131619] hover:text-gray-700">
          <a href="https://discord.gg/keQnv2K8HP">
            <FaDiscord size={24} />
          </a>
        </li>
        <li className="text-[#131619] hover:text-gray-700">
          <a href="https://github.com/TheForus">
            <FaGithub size={24} />
          </a>
        </li>
        <li className="text-[#131619] hover:text-gray-700">
          <a href="https://twitter.com/The_Forus">
            <FaTwitter size={24} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
