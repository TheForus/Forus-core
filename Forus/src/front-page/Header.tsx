import { useNavigate } from "react-router-dom";
import screenshot from "../assets/ForusKey.png";


const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="bg-[#e9e9f3] xl:px-36 md:px-22 px-8 sm:py-27 py-16 flex mb-4
          justify-between  items-center md:flex-row flex-col m-8 text-gray-700"
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-4 ml-6  md:w-[100%]">
          {/* features  texts */}
          <div className="flex montserrat-heading font-semibold space-x-4 items-center">
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
            className="flex text-gray-700 space-y-1 xl:-space-y-2 flex-col montserrat-heading font-extrabold
            text-left text-[1.2rem] md:text-[1.5rem] xl:text-[2.4rem]"
          >
            {/* Receive Eth and tokens with forus confidentially !! */}
            <span>Private & Secure</span>
            <span>transactions</span>
          </h2>
          <p
            className="montserrat-heading font-semibold pb-1 text-gray-600
           text-left break-words  max-w-[700px] sm:text-[1.2rem] text-[1rem]"
          >
            {/* Breaking the link between sender and receiver. Safeguard Your
            Financial Interactions with Cutting-edge Cryptography. */}
            Get funds privately without sharing wallet address !!
          </p>
          <button
            className="border-1 montserrat-heading  
            hover:scale-95 transition-all ease-linear p-2 px-10 rounded-full border-[#48494b] 
             montserrat-subtitle font-bold  text-xl bg-[#292a2c] text-gray-300"
            onClick={() => navigate("/forus")}
          >
            Launch App
          </button>
        </div>

        {/* right Banner */}
        <div className="flex justify-end items-center ">
          <img
            className="md:mt-0 mt-10 rounded-[1.5rem] object-center 
            shadow-xl shadow-[#757575]"
            src={screenshot}
            height={1200}
            width={1000}
            alt=""
          />
        </div>
      </div>
      {/* <Info /> */}
    </>
  );
};

export default Header;
