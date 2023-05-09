import React, { useEffect, useState } from "react";
import logo from "../Logos/White.png";
import logo2 from "../Logos/foxlogo.png";
import { Link } from "react-scroll";
import { HiSun } from "react-icons/hi";
import { HiOutlineMoon } from "react-icons/hi";
import { HiMoon } from "react-icons/hi";
import { BiSun } from "react-icons/bi";

// from-white to-black text-transparent bg-clip-text

type Props = {};

const Nav = (props: Props) => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  return (
    <div
      className="bg-[#10F1B4] dark:bg-black text-white dark:text-[#10F1B4] sm:px-20 px-12 p-5 flex 
        justify-between items-center border-b border-gray-300 dark:border-gray-400"
    >
      {/* logo left */}
      <div className="flex space-x-1 items-center">
        <img
          src={darkTheme ? logo2 : logo}
          alt=""
          className="w-[49px] h-[45px]"
        />
        <h1 className="montserrat-subtitle sm:text-[1.5rem] font-semibold text-[1.2rem]">
          Cryptia
        </h1>
      </div>
      {/* right side */}
      <div className="flex space-x-1 items-center">
        <Link spy={true} smooth={true} to="howitworks">
          <p
            className="text-white dark:text-[#10F1B4] dark:hover:text-gray-200 p-1 sm:px-4 rounded-lg 
            montserrat-subtitle cursor-pointer hover:text-gray-800 sm:text-[1.2rem] text-[0.9rem] font-semibold"
          >
            How it works?
          </p>
        </Link>
        {/* theme button */}
        <div
          onClick={() => setDarkTheme(!darkTheme)}
          className="focus:outline-none cursor-pointer dark:bg-bgBlack dark:hover:bg-gray-500 bg-[#10F1B4] hover:bg-[#22b48d] 
            sm:p-2 p-1 rounded-full border-2 dark:border-gray-500 border-gray-200"
        >
          <button className="transition-all theme-btn text-gray-200">
            {darkTheme ? (
              <>
                <BiSun size={30} className="text-gray-200 light hidden" />
                <HiSun size={30} className="dark hidden" />
              </>
            ) : (
              <>
                <HiOutlineMoon size={30} className="light hidden" />
                <HiMoon size={30} className="dark hidden" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
