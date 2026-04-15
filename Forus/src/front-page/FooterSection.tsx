import React from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pb-10 pt-4 text-center text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left">
      <p className="montserrat-small text-sm text-slate-400">
        Forus · Private transfers for everyday crypto
      </p>
      <ul className="flex items-center justify-center space-x-6 sm:justify-start">
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
