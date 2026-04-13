import { useContext } from "react";
import { ConnectKitButton } from "connectkit";
import { FaGithub, FaTwitter } from "react-icons/fa";
import logo from "../assets/logo-f.png";

import { AppContext } from "./Container";

type Props = {};

const NavBar = (props: Props) => {
  useContext(AppContext);

  return (
    <div className="px-4 pb-6 pt-4 sm:px-5 sm:pt-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center">
          <div className="flex items-center">
            <img src={logo} alt="Forus logo" className="h-[52px] w-[52px] rounded-full" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://github.com/TheForus"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-slate-400 transition-colors duration-200 hover:text-cyan-300"
            aria-label="Forus GitHub"
          >
            <FaGithub size={18} />
          </a>

          <a
            href="https://twitter.com/The_Forus"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-slate-400 transition-colors duration-200 hover:text-cyan-300"
            aria-label="Forus Twitter"
          >
            <FaTwitter size={18} />
          </a>

          <div className="relative flex items-center space-x-1 transition-all ease-in-out">
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
