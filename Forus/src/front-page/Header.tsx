import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pb-10 pt-10 sm:px-8">
        <div className="space-y-5">
          <h2 className="montserrat-heading text-left text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl lg:text-5xl">
            Send and receive crypto without revealing your wallet address.
          </h2>
          <p className="montserrat-subtitle max-w-xl text-left text-base text-slate-300 sm:text-lg">
            Forus uses stealth addresses and one-time keys so every transfer stays unlinkable,
            while your flow remains familiar.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="montserrat-subtitle rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-300 px-6 py-3 text-sm font-bold text-black transition hover:shadow-[0_12px_32px_rgba(45,212,191,0.25)]"
            onClick={() => navigate("/forus")}
          >
            Launch App
          </button>
          <a
            className="montserrat-subtitle rounded-full border border-slate-600/70 bg-slate-900/70 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-100"
            href="https://github.com/TheForus/Forus-core"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
