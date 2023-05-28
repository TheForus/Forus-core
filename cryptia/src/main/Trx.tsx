import React, { useState } from "react";
import Transfer from "./Transfer";
import Accept from "./Scan";

import { useContext } from "react";
import { AppContext } from "./Cryptia";

type Props = {};

const Trx = (props: Props) => {
  const { setShow } = useContext(AppContext);
  const [showTransfer, setShowTransfer] = useState(true);

  const handleTransferClick = () => {
    setShowTransfer(true);
    setShow(true);
  };

  const handleAcceptClick = () => {
    setShowTransfer(false);
    setShow(false);
  };

  console.log("showTransfer : ", showTransfer);

  return (
    <div
      className="flex flex-col sm:p-5 sm:px-8 backdrop-blur-[50px]
      max-w-[500px] hover:backdrop-blur-lg
     h-full"
    >
      <div
        className="max-w-[400px] xl:space-x-36 mx-auto flex space-x-32 mb-2  montserrat-subtitle
        text-[1.4rem] border-b-2 pb-2 border-gray-300 font-bold"
      >
        <button
          onClick={handleTransferClick}
          className={`px-3 
        ${showTransfer ? "text-[#0d1013]" : "text-[#5f6061]"}`}
        >
          Transfer
        </button>
        <button
          onClick={handleAcceptClick}
          className={`px-3 
        text-${!showTransfer ? "[#0d1013]" : "[#5f6061]"}`}
        >
          Accept
        </button>
      </div>
      {/* below buttons */}
      <div className="p-4 xl:w-[400px] w-[340px] mx-auto">
        {showTransfer ? <Transfer /> : <Accept />}
      </div>
    </div>
  );
};

export default Trx;
