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
      className="flex flex-col sm:p-5 sm:px-8 backdrop-blur-[50px]
      max-w-[500px] hover:backdrop-blur-lg
     h-full"
    >
      <div
        className="max-w-[400px] mx-auto flex mb-2  montserrat-subtitle
        text-[1.2rem] pb-2 border-bgGray font-bold"
      >
        <button
          onClick={handleTransferClick}
          className={`px-6 py-1 border-2 rounded-md border-gray-500
        ${buttonStatus.transfer ? "text-bgGray" : "text-[#5e5e5e]"}`}
        >
          Transfer
        </button>
        <button
          onClick={handleAcceptClick}
          className={`px-6 py-1 border-2 rounded-md border-gray-500
          ${buttonStatus.accept ? "text-bgGray" : "text-[#5e5e5e]"}`}
        >
          Accept
        </button>
        <button
          onClick={handleWithdrawClick}
          className={`px-6 py-1 border-2 rounded-md border-gray-500
          ${buttonStatus.withdraw ? "text-bgGray" : "text-[#5e5e5e]"}`}
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
