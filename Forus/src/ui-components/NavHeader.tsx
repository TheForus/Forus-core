import logo from "../Logos/logo.jpg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Container";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
// import { HiQuestionMarkCircle } from "react-icons/hi";
import { useState } from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp, MdOutlineDone } from "react-icons/md";
import { AiOutlineCopy } from "react-icons/ai";

type Props = {};

const NavBar = (props: Props) => {
  const connect = useContext(AppContext);
  const navigate = useNavigate();
  const [show, setshow] = useState<boolean>(false);
  const [isAddrHovered, setIsAddrHovered] = useState<boolean>(false);
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  console.log("connect : ", connect.userBalance);

  const changeChains = async (c: any) => {
    setshow(!show);
    sessionStorage.setItem("chain", c.name);
    await connect.handleChainChange(c.chainId);
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(
      sessionStorage.getItem("address") || ""
    );
    setAddressCopied(true);
  };

  console.log(addressCopied);

  // Function to handle hover
  const handleMouseEnter = () => {
    setIsAddrHovered(true);
  };

  // Function to handle mouse leave
  const handleMouseLeave = () => {
    setIsAddrHovered(false);
    setAddressCopied(false);
  };

  return (
    <div className="relative mx-auto max-w-[1300px] pb-12 pt-4 sm:pt-8   ">
      <div className="sm:px-7 px-4 flex justify-between">
        {/* leftside logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center logo-div">
            <img src={logo} alt="" className="logo w-[56px] h-[51px]" />
            <h1 className="-ml-1 montserrat-subtitle sm:text-[1.5rem] font-bold text-[1.4rem] text-white">
              Forus
            </h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center sm:space-x-8">
            <button
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center transition-all ease-linear
               md:items-end space-x-1 sm:ml-14 ml-9  text-white 
                montserrat-subtitle underline-offset-8 font-bold hover:underline decoration-bgGray  sm:text-[1.1rem] text-[0.8rem]"
            >
              <IoMdHome size={23} className="md:self-start  text-gray-300 " />
              <p className="sm:inline-flex hidden text-gray-300  n">Home</p>
            </button>

            <div
              onClick={() => navigate("/")}
              className="flex md:flex-row flex-col items-center md:items-end space-x-1 sm:ml-14 
               text-white   ml-2
                montserrat-subtitle underline-offset-8
                 font-bold hover:underline decoration-bgGray 
                 sm:text-[1.1rem] text-[0.8rem]"
            >
              <AiFillFilePdf
                size={23}
                className="md:self-start text-gray-300   "
              />
              <p className="sm:inline-flex hidden text-gray-300 ">Read</p>
            </div>
          </div>
        </div>

        {/* rigt side */}
        <div className="sm:flex-row flex space-x-3 items-center">
          {/* Social Links */}
          <div className="lg:flex space-x-3 items-center">
            <div className="lg:flex space-x-3 items-center hidden">
              <p className=" text-gray-300 ">
                <a href="https://discord.gg/keQnv2K8HP">
                  <FaDiscord size={22} />
                </a>
              </p>
              <p className="  text-gray-300  ">
                <a href="https://github.com/TheForus">
                  <FaGithub size={22} />
                </a>
              </p>
              <p className="  text-gray-300  ">
                <a href="https://twitter.com/The_Forus">
                  <FaTwitter size={22} />
                </a>
              </p>
            </div>

            {sessionStorage.getItem("address") !== null && (
              <div
                className="sm:static absolute left-3 bottom-2 montserrat-subtitle border-1 
              sm:text-[1rem] text-[0.9rem] px-2 sm:px-4
             rounded-full text-[#e9edf1] font-extrabold border border-gray-500 hover:border-highlight"
              >
                <ul
                  className=""
                  onMouseEnter={() => setshow(true)}
                  onMouseLeave={() => setshow(false)}
                >
                  <li
                    className="flex p-1 px-2 sm:px-4 cursor-pointer rounded-md text-white
                items-center gap-2 w-full lg:text-[0.9rem] text-[0.8rem]"
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
                    "transition-all ease-in py-2 border-none  shadow-md flex flex-col
                    rounded-b-md absolute -ml-1 mt-0 text-black bg-[#c6fffb] z-20
                    ${show ? "opacity-100" : "opacity-0"}`
                    }
                    onMouseLeave={() => setshow(false)}
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
          {/* Address Bar */}
          <div
            // onClick={copyAddress}
            className="flex items-center space-x-1 relative transition-all ease-in-out"
          >
            <div
              className="flex sm:flex-row sm:items-center 
            flex-col-reverse items-end space-x-3"
            >
              <p
                // onClick={copyAddress}
                className={`sm:text-[1rem] md:text-[0.9rem] montserrat-small text-cyan-500  font-semibold text-[0.8rem]`}
              >
                {sessionStorage.getItem("address") !== null || false
                  ? connect.userBalance
                  : ""}
              </p>
              <p
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={copyAddress}
                className={`sm:text-[1.3rem] md:text-[1rem] cursor-pointer montserrat-small text-white font-semibold text-[1rem]`}
              >
                {sessionStorage.getItem("address") !== null || false
                  ? `${sessionStorage
                    .getItem("address")
                    ?.slice(0, 9)}...${sessionStorage
                      .getItem("address")
                      ?.slice(-5)}`
                  : ""}
              </p>
            </div>
            {addressCopied ? (
              <MdOutlineDone
                className={` text-white font-bold text-[1.1rem] "text-white `}
              />
            ) : (
              <AiOutlineCopy
                className={`${isAddrHovered ? "inline-flex mt-2" : "hidden"
                  } text-white font-bold text-[1.2rem] "text-white `}
              />
            )}
          </div>
          {sessionStorage.getItem("address") === null || false ? (
            <button
              onClick={connect.connectWallet}
              className="flex space-x-1 justify-center w-[100%] mx-auto mb-4 my-2 py-1 montserrat-subtitle border-1  montserrat-subtitle  
          hover:shadow-xl px-3 text-center text-black highlight border border-black 
          rounded-md font-bold hover:border-highlight hover:text-highlight  transition-all ease-linear"
            > connect wallet</button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
