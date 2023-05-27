import React from "react";
import logo from "../Logos/logoCryptia.png";
import { Link } from "react-scroll";

// from-white to-black text-transparent bg-clip-text

type Props = {};

const Nav = (props: Props) => {

  return (
    <div
      className="bg-[#dbe6eb] dark:bg-black text-white dark:text-[#dbe6eb] sm:px-20 px-12 p-5 flex 
        justify-between items-center border-b border-gray-300 dark:border-gray-400"
    >
      {/* logo left */}
      <div className="flex space-x-1 items-center">
        <img
          src={logo}
          alt=""
          className="w-[55px] h-[52px]"
        />
        <h1 className="montserrat-subheading sm:text-[1.8rem] font-extrabold text-[1.6rem] text-[#131619]">
         Cryptia
        </h1>
      </div>
      {/* right side */}
      <div className="flex space-x-1 items-center">
        <Link spy={true} smooth={true} to="howitworks">
          <p
            className="text-[#131619] p-1 sm:px-4 rounded-lg 
            montserrat-subtitle cursor-pointer hover:text-gray-800 sm:text-[1.4rem] text-[1.2rem] font-semibold"
          >
            How it works?
          </p>
        </Link>
        {/* theme button */}
  
    
      </div>
    </div>
  );
};

export default Nav;
