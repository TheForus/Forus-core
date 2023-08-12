import logo from "../Logos/logo.jpg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Forus";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { HiQuestionMarkCircle } from "react-icons/hi";

type Props = {};

const NavBar = (props: Props) => {
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
            <img src={logo} alt="" className="logo w-[49px] h-[47px]" />
            <h1 className="montserrat-subtitle sm:text-[1.5rem] font-bold text-[1.4rem] text-[#cdd4dc]">
              Forus
            </h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center transition-all ease-linear
               md:items-end space-x-1 sm:ml-14 ml-9  text-[#cdd4dc] 
                montserrat-subtitle underline-offset-8 font-bold hover:underline decoration-[#cdd4dc]  sm:text-[1.1rem] text-[0.8rem]"
            >
              <IoMdHome size={23} className="md:self-start text-[#cdd4dc] " />
              <p className="sm:inline-flex hidden">Home</p>
            </button>
            <div
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center md:items-end space-x-1 sm:ml-14 
               text-[#cdd4dc]   ml-2
                montserrat-subtitle underline-offset-8
                 font-bold hover:underline decoration-[#cdd4dc] 
                 sm:text-[1.1rem] text-[0.8rem]"
            >
              <HiQuestionMarkCircle
                size={23}
                className="md:self-start text-[#cdd4dc]  "
              />
              <p className="sm:inline-flex hidden">QnA</p>
            </div>
          </div>
        </div>

        {/* rigt side */}
        <div className="sm:flex-row flex space-x-3 items-center">
          {/* Social Links */}
          <div className="lg:flex space-x-3 items-center hidden">
            <p className=" text-[#cdd4dc] ">
              <a href="https://discord.gg/EppRjheW">
                <FaDiscord size={22} />
              </a>
            </p>
            <p className=" text-[#cdd4dc]  ">
              <a href="https://github.com/TheForus">
                <FaGithub size={22} />
              </a>
            </p>
            <p className=" text-[#cdd4dc]  ">
              <a href="https://twitter.com/The_Forus">
                <FaTwitter size={22} />
              </a>
            </p>
          </div>

          <p className="sm:text-[1.1rem] montserrat-small text-[#cdd4dc]   font-semibold text-[1rem]">
            {sessionStorage.getItem("address") !== null || false
              ? `${sessionStorage.getItem("address")?.slice(0, 19)}...`
              : ""}
          </p>
          <button
            onClick={connect.connectWallet}
            className=" montserrat-subtitle border-1 p-1 sm:text-[1rem] text-[0.8rem] bg-[#9a9bd1]
                     shadow-md hover:shadow-lg px-2 sm:px-4 rounded-md  text-white font-bold border-black "
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

export default NavBar;
