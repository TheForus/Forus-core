import React, { useState } from "react";
import Transfer from "./Transfer";
import Accept from "./Accept";

import { useContext } from "react";
import { AppContext } from "./Forus";
import Withdraw from "./Withdraw";

type Props = {};

const Trx = (props: Props) => {
  const { setShow } = useContext(AppContext);
  const [buttonStatus, setButtonStatus] = useState({
    transfer: true,
    accept: false,
    withdraw: false,
  });

  const handleTransferClick = () => {
    setButtonStatus({
      accept: false,
      withdraw: false,
      transfer: true,
    });
    setShow(true);
  };

  const handleAcceptClick = () => {
    setButtonStatus({
      accept: true,
      withdraw: false,
      transfer: false,
    });
    setShow(false);
  };

  const handleWithdrawClick = () => {
    setButtonStatus({
      withdraw: true,
      accept: false,
      transfer: false,
    });
    setShow(false);
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
          onClick={handleAcceptClick}
          className={`px-6 py-1 border-b-2 border-black
          ${buttonStatus.accept ? "shadow-2xl border-b-2 border-cyan-800 text-transparent bg-clip-text bg-gradient-to-r from-highlight to-cyan-600 shadow-cyan-700" : "text-gray-700"}`}
        >
          Accept
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
        ) : buttonStatus.accept ? (
          <Accept />
        ) : (
          <Withdraw />
        )}
      </div>
    </div>
  );
};

export default Trx;
