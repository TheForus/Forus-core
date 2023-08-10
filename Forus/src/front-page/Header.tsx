import React from "react";
import { useNavigate } from "react-router-dom";
// import workflow from "../Logos/workflowCryptia.png";
// import cryptia from "../main/Cryptia"

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-[#cdd4dc] sm:px-20 px-12 sm:p-32 p-24 flex
      justify-between items-center md:flex-row flex-col space-y-8  "
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-6 mt-4 md:w-[70%]">
          <h2
            className="montserrat-subtitle font-extrabold sm:text-[3.4rem]
            text-left text-[2.6rem] text-[#131619]"
          >
            Receive Eth and tokens with forus anonynously ;)
          </h2>
          <p
            className="montserrat-small font-semibold text-[#161b1f] 
           text-left break-words  max-w-[700px] sm:text-[1.6rem] text-[1.3rem]"
          >
            Unlock the Power of Secure and Private Transactions!
            Breaking the link between sender and receiver!
            Safeguard Your Financial Interactions with Cutting-edge
            Cryptography.!
          </p>
          <button
            className="border-1 montserrat-subtitle  
            hover:scale-95 transition-all ease-linear p-2 px-12 rounded-lg border-[#131619] border: ;
             montserrat-subtitle font-bold  text-xl bg-[#131619] text-gray-300"
            onClick={() => navigate("/forus")}
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
