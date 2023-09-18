import React, { useState } from "react";
import Transfer from "./Transfer";
import Receive from "./Receive";

import { useContext } from "react";
import { AppContext } from "./Forus";
import Withdraw from "./Withdraw";

type Props = {};



const Transactions = (props: Props) => {
  const { setShow } = useContext(AppContext);
  const [buttonStatus, setButtonStatus] = useState({
    transfer: true,
    Receive: false,
    withdraw: false,
  });

  const [masterkey, setmasterkey] = useState<string | any>("");

  const handleTransferClick = () => {
    setButtonStatus({
      Receive: false,
      withdraw: false,
      transfer: true,
    });
    setShow("transfer");
  };

  const handleReceiveClick = () => {
    setButtonStatus({
      Receive: true,
      withdraw: false,
      transfer: false,
    });
    setShow("receive");
  };

  const handleWithdrawClick = () => {
    setButtonStatus({
      withdraw: true,
      Receive: false,
      transfer: false,
    });
    setShow("withdraw");
    console.log('hellow', buttonStatus);
  };
  return (
    <div
      className="flex flex-col sm:px-8 backdrop-blur-[50px]
      max-w-[500px] hover:backdrop-blur-lg"
    >
      <div
        className="max-w-[500px] mx-auto flex montserrat-subheading
        text-[1.4rem] pb-2 border-bgGray font-extrabold"
      >
        <button
          onClick={handleTransferClick}
          className={`px-6 py-1 border-b-2 border-black
        ${buttonStatus.transfer ? "shadow-2xl border-b-2 border-cyan-800 text-transparent bg-clip-text bg-gradient-to-r from-highlight to-cyan-600 shadow-cyan-700" : "text-gray-700"}`}
        >
          Transfer
        </button>
        <button
          onClick={handleReceiveClick}
          className={`px-6 py-1 border-b-2 border-black
          ${buttonStatus.Receive ? "shadow-2xl border-b-2 border-cyan-800 text-transparent bg-clip-text bg-gradient-to-r from-highlight to-cyan-600 shadow-cyan-700" : "text-gray-700"}`}
        >
          Receive
        </button>
        <button
          onClick={handleWithdrawClick}
          className={`px-6 py-1 border-b-2 border-black
          ${buttonStatus.withdraw ? "shadow-2xl border-b-2 border-cyan-800 text-transparent bg-clip-text bg-gradient-to-r from-highlight to-cyan-600 shadow-cyan-700" : "text-gray-700"}`}
        >
          Withdraw
        </button>
      </div>
      {/* below buttons */}
      <div className="py-1 xl:w-[400px] w-full">
        {buttonStatus.transfer ? (
          <Transfer />
        ) : buttonStatus.Receive ? (
          <Receive setmasterkey={setmasterkey} withdrawFunction={handleWithdrawClick} />
        ) : (
          <Withdraw masterkey={masterkey} setmasterkey={setmasterkey} />
        )}
      </div>
    </div>
  );
};

export default Transactions;
