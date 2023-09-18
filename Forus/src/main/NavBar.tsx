import logo from "../Logos/logo.jpg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Forus";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { useState, } from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import { AiOutlineCopy } from "react-icons/ai";

type Props = {};

const NavBar = (props: Props) => {
  const connect = useContext(AppContext);
  const navigate = useNavigate();
  const [show, setshow] = useState<boolean>(false);

  const changeChains = async (c: any) => {
    setshow(!show);
    sessionStorage.setItem("chain", c.name);
    await connect.handleChainChange(c.chainId);
  };

  const copyAddress = async () => {
    navigator.clipboard.writeText(sessionStorage.getItem("address") || "");
  }

  return (
    <div className=" mx-auto pt-4 sm:pt-8 pb-12   ">
      <div className="sm:px-7 px-4 flex justify-between">
        {/* leftside logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center logo-div">
            <img src={logo} alt="" className="logo w-[49px] h-[47px]" />
            <h1 className="-ml-1 montserrat-subtitle sm:text-[1.5rem] font-bold text-[1.4rem] text-bgGray">
              Forus
            </h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center transition-all ease-linear
               md:items-end space-x-1 sm:ml-14 ml-9  text-bgGray 
                montserrat-subtitle underline-offset-8 font-bold hover:underline decoration-bgGray  sm:text-[1.1rem] text-[0.8rem]"
            >
              <IoMdHome size={23} className="md:self-start text-bgGray " />
              <p className="sm:inline-flex hidden">Home</p>
            </button>
            <div
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center md:items-end space-x-1 sm:ml-14 
               text-bgGray   ml-2
                montserrat-subtitle underline-offset-8
                 font-bold hover:underline decoration-bgGray 
                 sm:text-[1.1rem] text-[0.8rem]"
            >
              <HiQuestionMarkCircle
                size={23}
                className="md:self-start text-bgGray  "
              />
              <p className="sm:inline-flex hidden">QnA</p>
            </div>

            <div
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center md:items-end space-x-1 sm:ml-14 
               text-bgGray   ml-2
                montserrat-subtitle underline-offset-8
                 font-bold hover:underline decoration-bgGray 
                 sm:text-[1.1rem] text-[0.8rem]"
            >
              <AiFillFilePdf
                size={23}
                className="md:self-start text-bgGray  "
              />
              <p className="sm:inline-flex hidden">Read</p>
            </div>
          </div>
        </div>

        {/* rigt side */}
        <div className="sm:flex-row flex space-x-3 items-center">
          {/* Social Links */}
          <div className="lg:flex space-x-3 items-center hidden">
            <p className=" text-bgGray ">
              <a href="https://discord.gg/keQnv2K8HP">
                <FaDiscord size={22} />
              </a>
            </p>
            <p className=" text-bgGray  ">
              <a href="https://github.com/TheForus">
                <FaGithub size={22} />
              </a>
            </p>
            <p className=" text-bgGray  ">
              <a href="https://twitter.com/The_Forus">
                <FaTwitter size={22} />
              </a>
            </p>

            {sessionStorage.getItem("address") !== null && (
              <div
                className=" montserrat-subtitle border-1 sm:text-[1rem] text-[0.9rem] px-2 sm:px-4
               rounded-full text-[#e9edf1] font-extrabold border border-gray-500 hover:border-white"
              >
                <ul className="" onClick={() => setshow(!show)}>
                  <li
                    className="flex p-1 px-2 sm:px-4 cursor-pointer rounded-md
                  items-center gap-2 w-full hover:text-white"
                  >
                    {sessionStorage.getItem("chain")}
                    {!show ? (
                      <MdArrowDropDown className="text-[1.4rem]" />
                    ) : (
                      <MdArrowDropUp className="text-[1.4rem]" />
                    )}
                  </li>
                  <div
                    className={`
              ${show &&
                      `transition-all ease-in py-2 border-none  shadow-md flex flex-col
                 rounded-b-md absolute ml-1 mt-1 text-black bg-bgGray z-10 `
                      }
            `}
                  >
                    {show &&
                      connect.chainOptions.map((chain: any) => (
                        <div className=" hover:bg-slate-500">
                          <li
                            className="flex flex-row-reverse p-1 px-4 cursor-pointer
                           font-semibold
                    items-center gap-2 hover:text-white
                     montserrat-small text-[0.9rem]
                    justify-between"
                            key={chain.name}
                            onClick={() => changeChains(chain)}
                          >
                            <img
                              src={chain.symbol}
                              alt=""
                              className="object-fill rounded-full"
                              height={12}
                              width={18}
                            />
                            {chain.name}
                          </li>
                        </div>
                      ))}
                  </div>
                </ul>
              </div>
            )}
          </div>

          <p onClick={copyAddress} className="sm:text-[1.1rem] montserrat-small text-bgGray   font-semibold text-[1rem]">
            {sessionStorage.getItem("address") !== null || false
              ? `${sessionStorage.getItem("address")?.slice(0, 9)}...${sessionStorage.getItem("address")?.slice(-5)}`
              : ""}
          </p>

          <AiOutlineCopy
              className="cursor-pointer font-bold text-2xl text-[181b1f] text-highlight"
              onClick={copyAddress}
            />
          <button
            onClick={connect.connectWallet}
            className=" montserrat-subtitle border-1 p-1 sm:text-[1rem] text-[0.8rem]
                    px-2 sm:px-4 rounded-md  highlight
                    bg-highlight text-black font-extrabold hover:bg-clip-text hover:border 
                    hover:border-highlight hover:text-highlight transition-all ease-linear bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500
                     "
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
