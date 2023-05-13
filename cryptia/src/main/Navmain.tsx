import logo from "../Logos/foxlogo.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Cryptia";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { HiQuestionMarkCircle } from "react-icons/hi";

type Props = {};

const Navmain = (props: Props) => {
  const connect = useContext(AppContext);
  const navigate = useNavigate();
  return (

    <div className="max-w-[1090px] mx-auto pt-4 sm:pt-8 pb-12 ">
      <div className="sm:px-7 px-4 flex justify-between">
        {/* leftside logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex space-x-1 items-center logo-div">
            <img src={logo} alt="" className="logo w-[35px] h-[32px]" />
            <h1 className="dark:text-white montserrat-subtitle sm:text-[1.3rem] font-bold text-[1.2rem] text-[#6c8492]">
              Cryptia
            </h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center transition-all ease-linear md:items-end space-x-1 sm:ml-14 ml-6 hover:text-gray-800 dark:hover:text-gray-200 text-[#91acbb] dark:text-gra-200 montserrat-subtitle underline-offset-8 font-bold hover:underline decoration-[#10F1B4]  sm:text-[1rem] text-[0.9rem]"
            >
              <IoMdHome size={28} className="md:self-start text-[#91acbb]" />
              <p>Home</p>
            </button>
            <div
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center md:items-end space-x-1 sm:ml-14 ml-6 hover:text-gray-800
               text-[#91acbb] dark:hover:text-gray-200 dark:text-gra-200
                montserrat-subtitle underline-offset-8
                 font-bold hover:underline decoration-[#10F1B4] 
                 sm:text-[1rem] text-[0.9rem]"
            >
              <HiQuestionMarkCircle
                size={28}
                className="md:self-start text-[#91acbb] dark:text-gra-200"
              />
              <p>QnA</p>
            </div>
          </div>
        </div>

        {/* rigt side */}
        <div className="sm:flex-row flex space-x-3 items-center">
          {/* Social Links */}
          <div className="sm:flex space-x-3 items-center hidden">
            <p className="text-[#91acbb] dark:hover:text-gray-300 hover:text-gray-700">
              <a href="/https://discord.gg/qupF3BrP">
                <FaDiscord size={20} />
              </a>
            </p>
            <p className="text-[#91acbb] dark:hover:text-gray-300 hover:text-gray-700">
              <a href="https://github.com/ScriptKiddii/Cloak">
                <FaGithub size={20} />
              </a>
            </p>
            <p className="text-[#91acbb] dark:hover:text-gray-300 hover:text-gray-700">
              <a href="https://twitter.com/TronCloak">
                <FaTwitter size={20} />
              </a>
            </p>
          </div>

          <p className="sm:text-[1rem] montserrat-small  text-gray-500  font-semibold text-[0.8rem]">
            {sessionStorage.getItem("address") !== null || false
              ? `${sessionStorage.getItem("address")?.slice(0, 19)}...`
              : ""}
          </p>
          <button
            onClick={connect.connectWallet}
            className="dark:text-gray-900 montserrat-subtitle border-1 p-1 sm:text-[1rem] text-[0.8rem]
                     hover:text-[#10F1B4] hover:bg-[white] dark:hover:bg-gray-600 dark:hover:text-gray-100
                     shadow-md hover:shadow-lg px-2 sm:px-4 rounded-md bg-[#10F1B4] text-[white] font-bold border-white "
          >
            {sessionStorage.getItem("address") === null || false
              ? "connect wallet"
              : "Connected"}
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default Navmain;
