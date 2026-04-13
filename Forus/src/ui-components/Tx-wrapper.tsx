import React, { useEffect, useState } from "react";
import Transfer from "./Transfer";
import { Receive } from "./Receive";
import Keys from "./keys";

import { useContext } from "react";
import { AppContext } from "./Container";
import Withdraw from "./Withdraw";

type Props = {};

const Transactions = (props: Props) => {
  const { setShow, show } = useContext(AppContext);
  const [buttonStatus, setButtonStatus] = useState({
    keygen: true,
    transfer: false,
    Receive: false,
    withdraw: false,
  });

  const [masterkey, setmasterkey] = useState<string | any>("");
  const [amountTowithdraw, setamountTowithdraw] = useState<string | any>("");

  useEffect(() => {
    setButtonStatus({
      keygen: show === "keygen",
      transfer: show === "transfer",
      Receive: show === "receive",
      withdraw: show === "withdraw",
    });
  }, [show]);

  const handleKeyGenerationClick = () => {
    setButtonStatus({
      keygen: true,
      Receive: false,
      withdraw: false,
      transfer: false,
    });
    setShow("keygen");
  };

  const handleTransferClick = () => {
    setButtonStatus({
      keygen: false,
      Receive: false,
      withdraw: false,
      transfer: true,
    });
    setShow("transfer");
  };

  const handleReceiveClick = () => {
    setButtonStatus({
      keygen: false,
      Receive: true,
      withdraw: false,
      transfer: false,
    });
    setShow("receive");
  };

  const handleWithdrawClick = () => {
    setButtonStatus({
      keygen: false,
      withdraw: true,
      Receive: false,
      transfer: false,
    });
    setShow("withdraw");
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <div className="mx-auto grid w-full max-w-2xl grid-cols-3 gap-3">
        <button
          onClick={handleKeyGenerationClick}
          className={`rounded-2xl border px-4 py-4 text-center montserrat-subheading text-[1rem] font-bold transition-all duration-200 ${
            buttonStatus.keygen
              ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
              : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500 hover:text-white"
          }`}
        >
          Key Generation
        </button>
        <button
          onClick={handleTransferClick}
          className={`rounded-2xl border px-4 py-4 text-center montserrat-subheading text-[1rem] font-bold transition-all duration-200 ${
            buttonStatus.transfer
              ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
              : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500 hover:text-white"
          }`}
        >
          Transfer
        </button>
        <button
          onClick={handleReceiveClick}
          className={`rounded-2xl border px-4 py-4 text-center montserrat-subheading text-[1rem] font-bold transition-all duration-200 ${
            buttonStatus.Receive
              ? "border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
              : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500 hover:text-white"
          }`}
        >
          Receive
        </button>
      </div>
      <div className="mt-8 w-full px-0 py-0">
        {buttonStatus.keygen ? (
          <Keys />
        ) : buttonStatus.transfer ? (
          <Transfer />
        ) : buttonStatus.Receive ? (
          <Receive
            setamountTowithdraw={setamountTowithdraw}
            amountTowithdraw={amountTowithdraw}
            setmasterkey={setmasterkey}
            show={show}
            withdrawFunction={handleWithdrawClick}
          />
        ) : (
          <Withdraw
            amountTowithdraw={amountTowithdraw}
            masterkey={masterkey}
            setmasterkey={setmasterkey}
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;
