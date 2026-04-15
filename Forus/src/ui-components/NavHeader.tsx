import { useContext } from "react";
import { ConnectKitButton } from "connectkit";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-f.png";

import { AppContext } from "./Container";

type Props = {};

const NavBar = (props: Props) => {
  useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="px-4 pb-6 pt-4 sm:px-5 sm:pt-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center space-x-3">
            <div className="flex items-center">
              <img src={logo} alt="Forus logo" className="h-[48px] w-[48px] rounded-full sm:h-[52px] sm:w-[52px]" />
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="montserrat-small rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:border-cyan-400/60 hover:text-cyan-300"
            >
              Home
            </button>
          </div>

          <div className="sm:hidden">
            <div className="relative flex min-w-0 max-w-[180px] items-center transition-all ease-in-out">
              <ConnectKitButton />
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-3">
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

            <div className="relative flex min-w-0 items-center space-x-1 transition-all ease-in-out">
              <ConnectKitButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
