import { useState } from "react";
import { BsBoxArrowInDown, BsDownload } from "react-icons/bs";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { ethers } from "ethers";
import ToolTip from "../helper/ToopTip";
import { MdOutlineDone } from "react-icons/md";
import { TbArrowsExchange2 } from "react-icons/tb";

interface ChildProps {
  masterkey: string | any;
  amountTowithdraw: string | any;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
}

const Withdraw = ({
  masterkey,
  setmasterkey,
  amountTowithdraw,
}: ChildProps) => {
  const [hideInput, sethideInput] = useState<boolean>(false);
  const notyf = new Notyf();

  const useConnect = () => {
    setmasterkey("");
    sethideInput(true);
  };

  // Function to handle file selection and reading its contents
  const handleFileUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    // Listen for the change event when a file is selected
    fileInput.addEventListener("change", async (event) => {
      const selectedFile = (event.target as HTMLInputElement).files?.[0]; // Type assertion

      if (selectedFile) {
        try {
          const contents = await readmasterkey(selectedFile);
          if (contents.startsWith("#walletprivateKey-")) {
            // Remove the prefix
            setmasterkey(contents.slice("#walletprivateKey-".length));
          } else {
            notyf.error("Please initialize MetaMask");
            return false;
          }
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }
    });

    // Trigger the file input to open the file picker dialog
    fileInput.click();
  };

  // Function to read file contents as text
  const readmasterkey = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const masterkey = event.target?.result as string; // Use optional chaining
        resolve(masterkey);
      };

      reader.onerror = (event) => {
        reject(event.target?.error);
      };

      reader.readAsText(file);
    });
  };

  const [rec, setrec] = useState<string | any>("");
  const [passed, setpassed] = useState<boolean | any>();

  const { ethereum }: any = window;

  const sendTransaction = async () => {
    setpassed(true);

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);

      const wallet = new ethers.Wallet(masterkey, provider);

      const tx = {
        to: hideInput === false ? rec : sessionStorage.getItem("address"), // Replace with the recipient's Ethereum address
        value: ethers.utils.parseEther(amountTowithdraw), // Amount in Ether to send
      };
      console.log(tx);

      const txResponse = await wallet.sendTransaction(tx);

      console.log("Transaction sent:", txResponse, tx);

      setpassed(false);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const toggle = () => {
    sethideInput(!hideInput);
    setrec(sessionStorage.getItem("address"));
  };

  return (
    <div className="pt-2 mx-auto">
      {/* <h2 className="text-bgGray text-[1.3rem] text-left mb-3">
        Recipient Address
      </h2> */}
      <div className="py-2 flex space-x-4 items-center justify-between">
        <div className={`flex-1 ${hideInput && 'justify-end'} flex space-x-2 justify-between items-center`}>
          {hideInput === false ? (
            <input
              type="text"
              className="flex-1 text-[0.9rem] font-semibold text-gray-100 placeholder:text-gray-500
          montserrat-subtitle outline-none px-4 py-3 rounded-md
          hover:border-cyan-900 w-[100%] bg-black/40 border-2 border-gray-500"
              onChange={(e) => {
                setrec(e.target.value);
              }}
              placeholder="Enter Recipient Address"
            />
          ) : (
            <h3 className="text-[1rem] text-gray-400">
              Withdraw funds to connected wallet !
            </h3>
          )}
          <>
            <ToolTip tooltip="Load Private Key">
              <button
                onClick={handleFileUpload}
                className="text-[0.9rem] text-gray-400 p-1 font-semibold montserrat-small"
              >
                {masterkey === "" ? (
                  <BsDownload
                    className="cursor-pointer  text-[#bbc1c9]"
                    size={24}
                  />
                ) : (
                  <MdOutlineDone
                    className="cursor-pointer  text-highlight"
                    size={28}
                  />
                )}
              </button>
            </ToolTip>
          </>
        </div>
        {/* Download Icon */}
        <div className="pl-4 text-gray-200 border-l border-gray-800 flex space-x-1 items-center">
          <ToolTip tooltip="Receive funds in your own connected wallet !">
            <TbArrowsExchange2
              onClick={toggle}
              className="text-[1.8rem] text-highlight cursor-pointer"
            />
          </ToolTip>
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="w-full flex justify-center pt-2 mr-4">
        <button
          onClick={sendTransaction}
          className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black 
          rounded-md font-bold hover:border-highlight hover:text-highlight transition-all ease-linear"
        >
          <BsBoxArrowInDown className="text-[1.3rem] text-inherit" />
          <p>Withdraw</p>
        </button>
      </div>

      <p className="text-[0.9rem] text-white">
        {passed === true ? "passing " : passed === false ? "passed" : ""}
      </p>
    </div>
  );
};

export default Withdraw;
