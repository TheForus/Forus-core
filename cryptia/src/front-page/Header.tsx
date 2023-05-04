import React from "react";
import { useNavigate } from "react-router-dom";
import workflow from "../Logos/work.png";

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-[#10F1B4] sm:px-20 px-12 p-10 flex 
      justify-between items-center md:flex-row flex-col space-y-6"
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-6 mt-12">
          <h2
            className="montserrat-subtitle font-bold sm:text-[2.0rem]
          text-left text-[2.4rem] text-[white]"
          >
            Stay anonymous & secure
          </h2>
          <p className="montserrat-small font-semibold text-[#58707e] text-left break-words  max-w-[400px] text-[1.1rem]">
            Unlock the Power of Secure and Private Transactions with Cryptia!
            Safeguard Your Financial Interactions with Cutting-edge
            Cryptography.!
          </p>
          <button
            className="border-1 montserrat-subtitle  hover:bg-gray-900 hover:text-[#10F1B4]
            p-1 px-9 rounded-lg bg-[#E8FDF4] hover:border-gray-900 border border-gray-300 text-[#00ca94]  montserrat-subtitle 
            font-semibold  text-xl"
            onClick={() => navigate("/Cryptia")}
          >
            Launch
          </button>
        </div>

        {/* right Banner */}
        <div className="md:ml-10">
          <img
            className="border-1 rounded-lg"
            src={workflow}
            alt=""
            height={120}
            width={650}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
