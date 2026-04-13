import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const Nav = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-3 pt-8 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-[linear-gradient(135deg,rgba(20,36,58,0.95)_0%,rgba(10,20,34,0.98)_100%)] shadow-[0_10px_30px_rgba(34,211,238,0.12)]">
          <span className="montserrat-subheading bg-gradient-to-br from-cyan-300 via-cyan-400 to-emerald-300 bg-clip-text text-[1.4rem] font-bold italic text-transparent">
            F
          </span>
        </div>
        <div>
          <p className="montserrat-subheading text-lg font-semibold leading-none text-slate-100">
            Forus
          </p>
          <p className="montserrat-small mt-1 text-[0.7rem] uppercase tracking-[0.22em] text-cyan-400/70">
            Stealth Payments
          </p>
        </div>
      </div>
      <button
        className="montserrat-subtitle rounded-full border border-cyan-400/40 bg-slate-900/70 px-5 py-2 text-sm font-bold text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100"
        onClick={() => navigate("/forus")}
      >
        Launch App
      </button>
    </div>
  );
};

export default Nav;
