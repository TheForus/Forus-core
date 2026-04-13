import React from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-10 pt-4 text-slate-400 sm:px-8">
      <p className="montserrat-small text-sm text-slate-400">
        Forus · Private transfers for everyday crypto
      </p>
      <ul className="flex items-center space-x-6">
        <li className="text-slate-400 hover:text-slate-200">
          <a href="https://github.com/TheForus">
            <FaGithub size={24} />
          </a>
        </li>
        <li className="text-slate-400 hover:text-slate-200">
          <a href="https://twitter.com/The_Forus">
            <FaTwitter size={24} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
