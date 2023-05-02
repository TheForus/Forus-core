import logo from "../Logos/foxlogo.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Cryptia";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

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
          <div className="flex space-x-1 items-center">
            <img src={logo} alt="" className="w-[35px] h-[32px]" />
            <h1 className="montserrat-subtitle sm:text-[1.3rem] font-semibold text-[1.1rem] text-[#6c8492]">
              Cryptia
            </h1>
          </div>

          <p className="sm:ml-14 ml-6 text-[#58707e] montserrat-subtitle underline-offset-8 font-semibold underline decoration-[#10F1B4]  text-[1.1rem]">
            Home
          </p>
          <p className="sm:ml-14 ml-6 text-[#58707e] montserrat-subtitle underline-offset-8 font-semibold underline decoration-[#10F1B4]  text-[1.1rem]">
            QnA
          </p>
        </div>

        {/* rigt side */}
        <div className="sm:flex-row flex-co flex space-x-3 items-center">
          <p className="text-[#91acbb]">
            <a href="/https://discord.gg/qupF3BrP">
              <FaDiscord size={20} />
            </a>
          </p>
          <p className="text-[#91acbb]">
            <a href="https://github.com/ScriptKiddii/Cloak">
              <FaGithub size={20} />
            </a>
          </p>
          <p className="text-[#91acbb]">
            <a href="https://twitter.com/TronCloak">
              <FaTwitter size={20} />
            </a>
          </p>
          <p className="sm:text-[1rem] montserrat-small  text-gray-500  font-semibold text-[0.8rem]">
            {sessionStorage.getItem("address") !== null || false
              ? `${sessionStorage.getItem("address")?.slice(0, 19)}...`
              : ""}
          </p>
          <button
            onClick={connect.connectWallet}
            className="montserrat-subtitle border-1 p-1 sm:text-[1rem] text-[0.8rem]
                     hover:text-[#10F1B4] hover:bg-[white]
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
