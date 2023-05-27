import React from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex p-10 w-full bg-[#dbe6eb] ">
      <ul className="flex space-x-8 items-center m-auto">
        <li className="text-[#131619] hover:text-gray-700">
          <a href="/https://discord.gg/qupF3BrP">
            <FaDiscord size={24} />
          </a>
        </li>
        <li className="text-[#131619] hover:text-gray-700">
          <a href="https://github.com/CryptiaProtocol">
            <FaGithub size={24} />
          </a>
        </li>
        <li className="text-[#131619] hover:text-gray-700">
          <a href="https://twitter.com/CryptiaProtocol">
            <FaTwitter size={24} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
