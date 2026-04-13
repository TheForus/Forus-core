import { useContext } from "react";
import { ConnectKitButton } from "connectkit";
import { FaGithub, FaTwitter } from "react-icons/fa";

import { AppContext } from "./Container";

type Props = {};

const NavBar = (props: Props) => {
  useContext(AppContext);

  return (
    <div className="px-4 pb-6 pt-4 sm:px-5 sm:pt-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center">
          <div className="flex items-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-cyan-400/40 bg-[linear-gradient(135deg,rgba(20,36,58,0.95)_0%,rgba(10,20,34,0.98)_100%)] shadow-[0_10px_30px_rgba(34,211,238,0.12)]">
              <span className="montserrat-subheading bg-gradient-to-br from-cyan-300 via-cyan-400 to-emerald-300 bg-clip-text text-[1.75rem] font-bold italic text-transparent">
                F
              </span>
            </div>
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
