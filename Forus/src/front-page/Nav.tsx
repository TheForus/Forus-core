import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-f.png";

type Props = {};

const Nav = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pb-3 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pt-8">
      <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-start">
        <div className="flex h-12 w-12 items-center justify-center">
          <img src={logo} alt="Forus logo" className="h-12 w-12 rounded-full" />
        </div>
        <div>
          <p className="montserrat-small mt-1 text-[0.7rem] uppercase tracking-[0.22em] text-cyan-400/70">
            Stealth Payments
          </p>
        </div>
      </div>
      <button
        className="montserrat-subtitle w-full rounded-full border border-cyan-400/40 bg-slate-900/70 px-5 py-2 text-sm font-bold text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100 sm:w-auto"
        onClick={() => navigate("/forus")}
      >
        Launch App
      </button>
    </div>
  );
};

export default Nav;
