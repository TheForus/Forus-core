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

  const [isSuccessfull, setisSuccessfull] = useState<string>('withdraw');

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
  const [error, seterror] = useState<string | ''>('');

  const { ethereum }: any = window;

  const sendTransaction = async () => {
    setisSuccessfull('withdrawing!!');

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const wallet = new ethers.Wallet(masterkey, provider);

      // Get the Ethereum address associated with the private key
      const address = wallet.address;

      // Ensure balance is retrieved in Ether
      const balance = await provider.getBalance(address);

      // const balanceEther = ethers.utils.formatEther(balanceWei);
      // const balance = parseFloat(balanceEther);
      // console.log(balance);

      // Get the gas price
      const gasPrice: ethers.BigNumber = await provider.getGasPrice();
      console.log(`Gas Price (Gwei): ${ethers.utils.formatUnits(gasPrice, 'gwei')}`);

      // Get the current gas limit from the latest block
      // const block = await provider.getBlock('latest');
      // const block = await provider.getBlock('latest');
      // const gasLimitAmount: any = block.gasLimit;
      const gasLimit: ethers.BigNumber = ethers.BigNumber.from(21000);
      console.log(`Gas Limit: ${gasLimit}`);

      // Calculate the gas cost based on the gas limit and gas price
      const gasCost: ethers.BigNumber = gasPrice.mul(gasLimit);
      console.log(gasCost);

      // Calculate the amount to send
      // const balance: ethers.BigNumber = await provider.getBalance('YOUR_ADDRESS');
      const gasCostInEther: number = parseFloat(ethers.utils.formatUnits(gasCost, 'ether'));
      console.log(gasCostInEther, ethers.utils.formatUnits(balance));
      const amountToSend: any = ethers.utils.formatUnits(balance.sub(gasCost));
      console.log(amountToSend);


      if (amountToSend > gasCostInEther) {
        const tx = {
          to: hideInput === false ? rec : sessionStorage.getItem("address"),
          value: ethers.utils.parseEther(amountToSend),
          gasPrice: gasPrice,
          gasLimit: gasLimit,

        };
        console.log(tx)

        const txResponse = await wallet.sendTransaction(tx);

        console.log('Transaction sent:', txResponse);
        seterror('Successfully sent!');
      }
      else {
        seterror('Insufficient funds to pay gas!!');
      }

    } catch (err: any) {

      console.log(err.message);
      seterror(err.message);
    }

    setisSuccessfull('Withdraw');

  };




  const toggle = () => {
    sethideInput(!hideInput);
    setrec(sessionStorage.getItem("address"));
  };

  return (
    <div className="pt-5 mx-auto">
      <div className="py-2 flex space-x-4 items-center justify-between">
        <div className={`flex-1 ${hideInput && 'justify-end'} flex space-x-2 justify-between items-center`}>
          {hideInput === false ? (
            <input
              type="text"
              className="flex-1 text-[0.9rem] font-semibold text-gray-400  placeholder:text-gray-500
          montserrat-subtitle outline-none px-4 py-3 rounded-md
          hover:border-cyan-900 w-[100%] bg-[#dedee9] border-2 border-gray-500"
              onChange={(e) => {
                setrec(e.target.value);
              }}
              placeholder="Enter Recipient Address"
            />
          ) : (
            <h3 className="text-[0.95rem] text-gray-400 montserrat-subtitle font-semibold ">
              Withdraw funds to Connected Wallet !
            </h3>
          )}

          <>
            <div className=" pr-1 text-gray-200 flex space-x-1 items-center">
              <ToolTip tooltip="Get funds in the Connected wallet !">
                <TbArrowsExchange2
                  onClick={toggle}
                  className="text-[1.8rem] text-highlight cursor-pointer"
                />
              </ToolTip>
            </div>
            <ToolTip tooltip={(masterkey == "") ? "Load Private Key" : "Private Key Loaded !"}>
              <button
                onClick={handleFileUpload}
                className="text-[0.9rem] pl-3  border-l border-gray-500 text-gray-400 p-1 font-semibold montserrat-small"
              >
                {masterkey === "" ? (
                  <BsDownload
                    className="cursor-pointer  text-[#65686b]"
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

      </div>

      {/* Withdraw Button */}
      <div className="w-full flex justify-center pt-3 mr-4">
        <button
          onClick={sendTransaction}
          className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle border-1 py-2 montserrat-subtitle  
          hover:shadow-xl px-6 text-center text-black highlight border border-black 
          rounded-md font-bold  transition-all ease-linear"
        >
          <BsBoxArrowInDown className="text-[1.3rem] text-inherit" />
          <span>{isSuccessfull}</span>
        </button>
      </div>

      <p className={`text-[0.9rem] font-bold montserrat-small ${error === ' Successfully sent! ' ? ' text-highlight ' : 'text-red-500'}`}>
        {error}
      </p>

    </div>
  );
};

export default Withdraw;
