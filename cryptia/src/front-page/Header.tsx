import React from "react";
import { useNavigate } from "react-router-dom";
import workflow from "../Logos/workflowCryptia.png";
// import cryptia from "../main/Cryptia"

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-[#dbe6eb]  sm:px-20 px-12 p-32 flex
      justify-between items-center md:flex-row flex-col space-y-8  "
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-6 mt-4 w-[70%]">
          <h2
            className="montserrat-subtitle font-extrabold sm:text-[3.4rem]
          text-left text-[3.4rem] text-[#131619]"
          >
            Exchange Xdc and tokens with cryptia anonynously ;)
          </h2>
          <p className="montserrat-small font-semibold text-[#161b1f]  text-left break-words  max-w-[700px] text-[1.6rem]">
            Unlock the Power of Secure and Private Transactions with Cryptia!
            Safeguard Your Financial Interactions with Cutting-edge
            Cryptography.!
          </p>
          <button
            className="border-1 montserrat-subtitle  bg-[#dbe6eb] text-[#131619]
            p-2 px-12 rounded-lg  border-[#131619] border   montserrat-subtitle 
            font-bold  text-xl"
            onClick={() => navigate('/cryptia')}
          >
            Launch
          </button>
        </div>

        {/* right Banner */}
        {/* <div className="md:ml-10 w-[40%]">
          <img
            className="border-1 rounded-lg"
            src={workflow}
            alt=""
            height={160}
            width={650}
          />
        </div> */}
      </div>
    </>
  );
};

export default Header;
