import { useState, useMemo } from "react";

import { BsBoxArrowInDown, BsDownload } from "react-icons/bs";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { ethers } from "ethers";
import ToolTip from "../helpers/ToopTip";
import { MdOutlineDone } from "react-icons/md";
import { TbTransferIn, TbSwitchVertical } from "react-icons/tb";

//gelato setup

import {
  GelatoRelay,
  CallWithSyncFeeERC2771Request,
} from "@gelatonetwork/relay-sdk";
const relay = new GelatoRelay();

interface ChildProps {
  masterkey: string | any;
  amountTowithdraw: string | any;
  setmasterkey: React.Dispatch<React.SetStateAction<string | any>>;
}

const Withdraw = ({
  masterkey,
  setmasterkey,
}: // amountTowithdraw,
ChildProps) => {
  const [isInput, setisInput] = useState<boolean>(false);
  const notyf = new Notyf();

  const [isSuccessfull, setisSuccessfull] = useState<string>("withdraw");

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
            // Removing  the prefix
            setmasterkey(contents.slice("#walletprivateKey-".length));
          } else {
            notyf.error("Invalid file");
            seterror("Invalid file");
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

  const [receipentAdd, setreceipentAdd] = useState<string | any>("");
  const [error, seterror] = useState<string | "">("");

  const { ethereum }: any = window;

  const provider : any = useMemo(() => {
    return new ethers.providers.Web3Provider(ethereum);
  }, []);

  const sendTransaction = async () => {
    let balance;

    try {
      setisSuccessfull("Withdrawing Amount...");

      const wallet = new ethers.Wallet(masterkey, provider);

      // Get the Ethereum address associated with the private key
      const address = wallet.address;

      const user = address;

      // const etherBalance = await provider.getBalance(user);

      // if (etherBalance.isZero()) {
      //   // list of ERC-20 token addresses

      //   const erc20TokenAddresses = [
      //     "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // USDT
      //     "0x912CE59144191C1204E64559FE8253a0e49E6548", // ARB
      //   ];

      //   let selectedTokenAddress = null;

      //   // ABI to check ERC-20 token balance

      //   const balanceAbi = [
      //     "function balanceOf(address owner) view returns (uint256)",
      //   ];

      //   // loop through each token and check the balance
      //   for (const tokenAddress of erc20TokenAddresses) {
      //     const tokenContract = new ethers.Contract(
      //       tokenAddress,
      //       balanceAbi,
      //       provider
      //     );
      //     balance = await tokenContract.balanceOf(user);

      //     // if the balance is greater than 0, select this token and break the loop

      //     if (balance.gt(0)) {
      //       selectedTokenAddress = tokenAddress;
      //       break;
      //     }
      //   }

      //   const amountToSend: any = ethers.utils.formatUnits(balance);

      //   // Proceed only if a valid token with a balance > 0 is found

      //   if (selectedTokenAddress) {
      //     // ABI for the transfer function

      //     const transferAbi = ["function transfer(address to, uint256 amount)"];
      //     const contract = new ethers.Contract(
      //       selectedTokenAddress,
      //       transferAbi,
      //       wallet
      //     );

      //     // specify the recipient address and amount to transfer
      //     const recipient =
      //       isInput === false
      //         ? receipentAdd
      //         : sessionStorage.getItem("address");

      //     const amount = ethers.utils.parseUnits(amountToSend, 18);

      //     // Prepare the transaction data for transfer
      //     const txData = await contract.populateTransaction.transfer(
      //       recipient,
      //       amount
      //     );

      //     // Populate the relay SDK request body
      //     const request : any = {
      //       chainId: (await provider.getNetwork()).chainId,
      //       target: selectedTokenAddress,
      //       data: txData.data,
      //       user: user,
      //       feeToken: selectedTokenAddress,
      //       isRelayContext: true,
      //     };

      //     // Send relayRequest to Gelato Relay API
      //     const relayResponse = await relay.callWithSyncFeeERC2771(
      //       request,
      //       provider
      //     );

      //     if (relayResponse) {
      //       setisSuccessfull(
      //         `Transaction Hash : ${relayResponse}`
      //       );
      //     } else {
      //       setisSuccessfull("Something went wrong");
      //     }


      //     //if the user has none erc20 token balance
          
      //   } else {
          try {
            const provider = new ethers.providers.Web3Provider(ethereum);

            const wallet = new ethers.Wallet(masterkey, provider);

            // Get the Ethereum address associated with the private key
            const address = wallet.address;

            // Ensure balance is retrieved in Ether
            const balance = await provider.getBalance(address);

            // Get the gas price
            const gasPrice: ethers.BigNumber = await provider.getGasPrice();
            console.log(
              `Gas Price (Gwei): ${ethers.utils.formatUnits(gasPrice, "gwei")}`
            );

            const gasLimit: ethers.BigNumber = ethers.BigNumber.from(21000);
            // console.log(`Gas Limit: ${gasLimit}`);

            // Calculate the gas cost based on the gas limit and gas price
            const gasCost: ethers.BigNumber = gasPrice.mul(gasLimit);
            console.log(gasCost);

            // Calculate the amount to send
            // const balance: ethers.BigNumber = await provider.getBalance('YOUR_ADDRESS');

            const gasCostInEther: number = parseFloat(
              ethers.utils.formatUnits(gasCost, "ether")
            );
            // console.log(gasCostInEther, ethers.utils.formatUnits(balance));
            const amountToSend: any = ethers.utils.formatUnits(
              balance.sub(gasCost)
            );
            // console.log(amountToSend);

            if (amountToSend > gasCostInEther) {
              const tx = {
                to:
                  isInput === false
                    ? receipentAdd
                    : sessionStorage.getItem("address"),
                value: ethers.utils.parseEther(amountToSend),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
              };

              console.log(tx);

              const gasEstimate = await wallet.estimateGas(tx);
              console.log("Gas Estimate:", gasEstimate.toNumber());

              const txResponse = await wallet.sendTransaction(tx);

              console.log("Transaction sent:", txResponse);
              seterror("Successfully sent!");
            } else {
              seterror("Insufficient funds to cover Gas fee !");
            }
          } catch (err: any) {
            console.log(err.message);
            seterror(err.message);
          }
        // }
      // }

      setisSuccessfull("Withdraw");
    } catch (error) {
      console.error("An error occurred during the transaction:", error);
      setisSuccessfull("Error occurred during withdrawal");
    }
  };

  const toggle = () => {
    setisInput(!isInput);
    setreceipentAdd(sessionStorage.getItem("address"));
  };

  return (
    <div className="pt-5 mx-auto">
      <div className="py-2 flex space-x-4 items-center justify-between">
        <div
          className={`flex-1 ${
            isInput && "justify-end"
          } flex space-x-2 justify-between items-center`}
        >
          {isInput === false ? (
            <input
              type="text"
              className="flex-1 text-[0.9rem] font-semibold text-gray-300  placeholder:text-gray-500
          montserrat-subtitle outline-none px-4 py-3 rounded-md
          hover:border-cyan-900 w-[100%] bg-black/10 border-2 border-gray-600"
              onChange={(e) => {
                setreceipentAdd(e.target.value);
              }}
              placeholder="Enter receipent Address"
            />
          ) : (
            <h3 className="text-[0.95rem] text-gray-400 montserrat-subtitle font-semibold ">
              Or withdraw funds to Connected Wallet !
            </h3>
          )}

          <>
            <div className=" pr-1 text-gray-200 flex space-x-1 items-center">
              <ToolTip tooltip="Get funds in the Connected wallet !">
                <TbSwitchVertical
                  onClick={toggle}
                  className="text-[1.8rem] text-highlight cursor-pointer"
                />
              </ToolTip>
            </div>
            <ToolTip
              tooltip={
                masterkey == "" ? "Load Private Key" : "Private Key Loaded !"
              }
            >
              <button
                onClick={handleFileUpload}
                className="text-[0.9rem] pl-3  border-l border-gray-500 text-gray-400 p-1 font-semibold montserrat-small"
              >
                {masterkey === "" ? (
                  <BsDownload
                    className="cursor-pointer  text-[#d9d9da]"
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
          className="flex space-x-2 justify-center w-[100%] mx-auto mb-4 my-2 montserrat-subtitle py-2 
          hover:shadow-xl px-6 text-center text-black highlight j
          rounded-md font-bold  transition-all ease-linear"
        >
          <TbTransferIn className="text-[1.3rem] text-inherit" />
          <span>{isSuccessfull}</span>
        </button>
      </div>

      <p
        className={`text-[.9rem] font-bold montserrat-small ${
          error === "Successfully sent!"
            ? "montserrat-subtitle flex mx-auto items-center animate-pulse-2s montserrat-small  text-highlight  text-center font-semibold underline underline-offset-8 decoration-bgGray cursor-pointer "
            : "text-red-500"
        }`}
      >
        {error}
      </p>
    </div>
  );
};

export default Withdraw;
