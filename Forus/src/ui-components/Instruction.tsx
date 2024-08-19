import { useContext } from "react";
import { AppContext } from "./Container";
import { MdVerifiedUser } from "react-icons/md";

type Props = {};

const Instruction = (props: Props) => {
  const { show, totalfunds, totalAddress } = useContext(AppContext);
  return (
    <>
      <div className="sm:w-[50%] md:w-[80%] ml-8 h-full overflow-hidden">
        {show === "transfer" ? (
          <div className="flex text-left flex-col gap-3">
            {" "}
            {/* on Transfer */}
            <h1 className="montserrat-subheading  text-gray-300 font-semibold text-[1.5rem]">
              Transfer
            </h1>
            <div className="w-full py-4 montserrat-heading  text-gray-300 flex flex-col gap-4 items-start">
              <div className="flex space-x-2 ">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Safely insert the Receipent's <b>Forus key</b> into the designated
                  field.
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Specify the exact amount and the specific token or coin you
                  intend to transfer, ensuring a flawless transaction.
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Securely initiate funds with Transfer button, ensuring
                  prompt delivery of funds to the  stealth address .
                </p>
              </div>
            </div>
            <div className="montserrat-heading  text-gray-300">
              <h4 className="font-semibold text-gray-300 text-[1.1rem]">
                {totalAddress}
              </h4>
              <p>More than {totalAddress} stealth addresses have been generated</p>
            </div>
          </div>
        ) : show === "receive" ? (
          <div className="flex text-left flex-col gap-3">
            {" "}
            {/* on Accept */}
            <h1 className="montserrat-subheading text-gray-300 font-semibold text-[1.5rem]">
              Receive
            </h1>
            <div className="py-4 montserrat-heading text-gray-300 flex flex-col gap-4 items-start">
              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Click on the <b>Scan</b> button , paste your <b>Signature key</b> in the designated field
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Click on view transaction to see the list of  stealth adresses having funds in them .
                </p>
              </div>

              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Copy the private key of your stealth address and gain access to your
                  stealth address.
                </p>
              </div>
            </div>
            <div className="montserrat-heading  text-gray-300 ">
              <h4 className="font-semibold text-[1.1rem]"> {totalfunds}</h4>
              <p>More than {totalfunds} funds have been received</p>
            </div>
          </div>
        )
          :

          <div className="flex text-left flex-col gap-3">
            {" "}
            {/* on Accept */}
            <h1 className="montserrat-subheading text-gray-300 font-semibold text-[1.5rem]">
              Withdraw
            </h1>
            <div className="py-4 montserrat-heading  text-gray-300 flex flex-col gap-4 items-start">
              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                Load your #wallet-privateKey to help you withdraw funds easily . If already loaded ✔. Cool! 
                just pass the receipent address or use the connected wallet as receipent!
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser className="text-highlight "size={29} />
                <p className="flex-1">
                  Click on the "Withdraw" button to withdraw funds from stealth address to receipent's address.
                </p>
              </div>


            </div>
            <div className="montserrat-heading  text-gray-300 ">
              <h4 className="font-semibold text-[1.1rem]"> {totalfunds}</h4>
              <p>More than {totalfunds} funds have been received</p>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default Instruction;

/*

*/
