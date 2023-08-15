import React from "react";
import logo from "../Logos/whitelogo.jpg";
import { Link } from "react-scroll";

// from-white to-black text-transparent bg-clip-text

type Props = {};

const Nav = (props: Props) => {
  return (
    <div
      className="bg-[#cdd4dc] text-white sm:px-20 px-12 p-5 flex 
        justify-between items-center border-b border-gray-300"
    >
      {/* logo left */}
      <div className="-ml-6 flex items-center">
        <img src={logo} alt="" className="w-[85px] h-[82px]" />
        <h1 className="-ml-2 montserrat-subheading sm:text-[1.8rem] font-extrabold text-[1.6rem] text-[#131619]">
          Forus
        </h1>
      </div>
      {/* right side */}
      <div className="flex space-x-1 items-center">
        <Link spy={true} smooth={true} to="howitworks">
          <p
            className="text-gray-700 hover:text-gray-900 p-1 sm:px-4 rounded-lg 
            montserrat-subtitle cursor-pointer 
            sm:text-[1.3rem] text-[1.1rem] font-semibold"
          >
            How it works ?
          </p>
        </Link>
        {/* theme button */}
      </div>
    </div>
  );
};

export default Nav;
