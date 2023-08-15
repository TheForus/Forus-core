import React from "react";
import { useNavigate } from "react-router-dom";
// import workflow from "../Logos/workflowCryptia.png";
// import cryptia from "../main/Cryptia"

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-[#cdd4dc] sm:px-17 px-12 sm:p-27 p-16 flex
      justify-between items-center md:flex-row flex-col space-y-4  "
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-4 mt- md:w-[100%]">
          <h2
            className="montserrat-subtitle font-extrabold sm:text-[2.6rem]
            text-left text-[1.7rem] text-[#131619] xl:w-[70%] w-full"
          >
            Receive Eth and tokens with forus confidentially
          </h2>
          <p
            className="montserrat-small font-semibold pb-4 text-gray-800
           text-left break-words  max-w-[700px] sm:text-[1.2rem] text-[1rem]"
          >
            Breaking the link between sender and receiver !!
            Safeguard Your Financial Interactions with Cutting-edge
            Cryptography.!
          </p>
          <button
            className="border-1 montserrat-subtitle  
            hover:scale-95 transition-all ease-linear p-1 px-10 rounded-lg border-[#131619] 
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
