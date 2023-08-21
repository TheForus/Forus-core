import React from "react";
import { useNavigate } from "react-router-dom";
import screenshot from "../assets/screenshot.png";

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-bgGray xl:px-36 md:px-22 px-8 sm:py-27 py-16 flex
          justify-between items-center md:flex-row flex-col space-y-1"
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-4 ml-6  md:w-[100%]">
          {/* features  texts */}
          <div className="flex space-x-4 items-center">
            {/* inner boxes */}
            <span
              className="p-1 px-8 border-2
             border-gray-600 rounded-full"
            >
              Easy to Use
            </span>
            <span
              className="p-1 px-8 border-2
             border-gray-600 rounded-full"
            >
              Secure
            </span>
          </div>

          <h2
            className="montserrat-heading font-extrabold sm:text-[2.6rem]
            text-left text-[1.7rem] xl:text-[3.5rem] text-[#131619] xl:w-[60%]"
          >
            {/* Receive Eth and tokens with forus confidentially !! */}
            Confidential & Secure transactions
          </h2>
          <p
            className="montserrat-small font-semibold pb-1 text-gray-800
           text-left break-words  max-w-[700px] sm:text-[1.2rem] text-[1rem]"
          >
            {/* Breaking the link between sender and receiver. Safeguard Your
            Financial Interactions with Cutting-edge Cryptography. */}
            Bringing confidentiality while receiving funds !!!
          </p>
          <button
            className="border-1 montserrat-subtitle  
            hover:scale-95 transition-all ease-linear p-1 px-10 rounded-full border-[#131619] 
             montserrat-subtitle font-bold  text-xl bg-[#131619] text-gray-300"
            onClick={() => navigate("/forus")}
          >
            Launch
          </button>
        </div>

        {/* right Banner */}
        <div className="flex justify-end items-center">
          <img
            className="md:mt-0 mt-10 rounded-[1.7rem] object-center xl:w-[800px] md:w-[900px]
            lg:h-[280px] h-[250px] sm:[mt-0]
            shadow-xl shadow-[#757575]"
            src={screenshot}
            // height={1000}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Header;
