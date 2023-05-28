import logo from "../Logos/logoCryptia.png";
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
    <div className=" mx-auto pt-4 sm:pt-8 pb-12   ">
      <div className="sm:px-7 px-4 flex justify-between">
        {/* leftside logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex space-x-1 items-center logo-div">
            <img src={logo} alt="" className="logo w-[35px] h-[32px]" />
            <h1 className="montserrat-subtitle sm:text-[1.3rem] font-bold text-[1.4rem] text-[#181b1f]">
              Cryptia
            </h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center transition-all ease-linear
               md:items-end space-x-1 sm:ml-14 ml-9 hover:text-gray-900 text-[#181b1f] 
                montserrat-subtitle underline-offset-8 font-bold hover:underline decoration-[#181b1f]  sm:text-[1.3rem] text-[0.9rem]"
            >
              <IoMdHome size={28} className="md:self-start text-gray-700" />
              <p className="sm:inline-flex hidden">Home</p>
            </button>
            <div
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center md:items-end space-x-1 sm:ml-14 
               text-[#181b1f] hover:text-gray-900 ml-2
                montserrat-subtitle underline-offset-8
                 font-bold hover:underline decoration-[#181b1f] 
                 sm:text-[1.3rem] text-[0.9rem]"
            >
              <HiQuestionMarkCircle
                size={28}
                className="md:self-start text-gray-700 "
              />
              <p className="sm:inline-flex hidden">QnA</p>
            </div>
          </div>
        </div>

        {/* rigt side */}
        <div className="sm:flex-row flex space-x-3 items-center">
          {/* Social Links */}
          <div className="lg:flex space-x-3 items-center hidden">
            <p className=" text-gray-700 hover:text-gray-900">
              <a href="/https://discord.gg/qupF3BrP">
                <FaDiscord size={26} />
              </a>
            </p>
            <p className=" text-gray-700 hover:text-gray-900">
              <a href="https://github.com/CryptiaProtocol">
                <FaGithub size={26} />
              </a>
            </p>
            <p className=" text-gray-700 hover:text-gray-900">
              <a href="https://twitter.com/CryptiaProtocol">
                <FaTwitter size={26} />
              </a>
            </p>
          </div>

          <p className="sm:text-[1.1rem] montserrat-small  text-gray-500  font-semibold text-[1rem]">
            {sessionStorage.getItem("address") !== null || false
              ? `${sessionStorage.getItem("address")?.slice(0, 19)}...`
              : ""}
          </p>
          <button
            onClick={connect.connectWallet}
            className=" montserrat-subtitle border-1 p-1 sm:text-[1.1rem] text-[0.9rem]
                     shadow-md hover:shadow-lg px-2 sm:px-4 rounded-md  text-[black] font-bold border-black "
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
