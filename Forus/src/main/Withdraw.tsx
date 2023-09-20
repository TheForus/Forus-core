import { useState } from "react";
import { BsDownload } from "react-icons/bs";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { ethers } from "ethers";
import ToolTip from "../helper/ToopTip";
import { HiWallet } from "react-icons/hi2";

interface ChildProps {
  masterkey: string | any;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
}

const Withdraw = ({ masterkey, setmasterkey }: ChildProps) => {
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
    console.log("masterkey", masterkey);
    setpassed(true);

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);

      // if (masterkey.startsWith("#walletprivateKey-")) {

      //   // Remove the prefix
      //   setmasterkey(masterkey.slice("#walletprivateKey-".length));

      // }
      // console.log(masterkey)

      const wallet = new ethers.Wallet(masterkey, provider);

      const tx = {
        to: rec, // Replace with the recipient's Ethereum address
        value: ethers.utils.parseEther("0.000001"), // Amount in Ether to send
      };

      const txResponse = await wallet.sendTransaction(tx);

      console.log("Transaction sent:", txResponse, tx);

      setpassed(false);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const sendTransactionWallet = async () => {
    setpassed(true);
    try {
      // Check if MetaMask is installed and connected
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        // Get the signer (user's wallet)
        const signer = provider.getSigner();

        // Specify the recipient's Ethereum address
        const recipientAddress = rec; // Replace with the recipient's address

        // Specify the amount to send (in Wei)
        const amountInWei = ethers.utils.parseEther("0.001"); // Sending 0.1 Ether

        // Create a transaction object
        const tx = {
          to: recipientAddress,
          value: amountInWei,
        };

        // Send the transaction and get the transaction hash
        const txResponse = await signer.sendTransaction(tx);

        console.log("Transaction sent:", txResponse);

        setpassed(false);
      } else {
        console.error("MetaMask not found or not connected.");
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className="pl-2 w-[90%] mx-auto">
      <h2 className="pl-2 text-bgGray text-[1.3rem] text-left mb-3">
        Recipient Address
      </h2>
      <div className="py-2 flex space-x-4 justify-between">
        <div className="flex-1 flex space-x-2 items-center">
          {!hideInput ? (
            <>
              <input
                type="text"
                className="flex-1 text-[0.9rem] font-semibold text-gray-100 placeholder:text-gray-500
          montserrat-subtitle outline-none px-3 py-3 h-[100%] rounded-md
          hover:border-cyan-900 w-[100%] bg-black/40 border-2 border-gray-500"
                // className=" text-[0.9rem] tect font-semibold text-gray-700 placeholder:text-gray-700
                //   montserrat-subtitle outline-none px-3 py-3 h-[100%] hover:shadow-sm rounded-md hover:shadow-gray-400 w-[100%] bg-bgGray"
                // value={savedSignaturekey}
                onChange={(e) => {
                  setrec(e.target.value);
                }}
                placeholder="Enter Recipient Address"
              />
              <ToolTip tooltip="Load Private Key">
                <button
                  onClick={handleFileUpload}
                  className="text-[0.9rem] text-gray-400 p-1 font-semibold montserrat-small"
                >
                  <BsDownload
                    className="cursor-pointer  text-[#bbc1c9]"
                    size={28}
                  />
                </button>
                {/* {masterkey === "" ? "load" : " ✅"} */}
              </ToolTip>
            </>
          ) : (
          <h3 className="text-[1rem] text-gray-400">using connectWallet to receive funds !</h3>
          )}
        </div>
        {/* Download Icon */}
        <div className="pl-4 text-gray-200 border-l border-gray-800 flex space-x-1 items-center">
          <HiWallet className="text-[1.3rem] text-highlight" />
          <ToolTip tooltip="Receive funds in your own connected wallet !">
            <input
              type="checkbox"
              checked={hideInput} // Bind the checkbox to the state value
              onChange={() => sethideInput(!hideInput)} // Call the handler on checkbox change
              className="text-gray-400 px-10 font-semibold montserrat-small"
            />
          </ToolTip>
          {/* use connectedWallet */}
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="w-full flex justify-center pt-2 mr-4">
        <button
          onClick={masterkey !== "" ? sendTransaction : sendTransactionWallet}
          className="w-[97%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black 
          rounded-md font-bold hover:border-highlight hover:text-highlight transition-all ease-linear"
          // onClick={generateprivatekey}
        >
          {/* <GiKangaroo size={26} /> */}
          Withdraw
        </button>
      </div>

      <p className="text-[0.9rem] text-white">
        {passed === true ? "passing " : passed === false ? "passed" : ""}
      </p>
      {/* message */}

      {/* <p className="text-[0.9rem] text-white">{masterkey}</p> */}
    </div>
  );
};

export default Withdraw;
