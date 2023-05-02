import { useContext } from "react";
import { AppContext } from "./Cryptia";
import { MdVerifiedUser } from "react-icons/md";

type Props = {};

const Instruction = (props: Props) => {
  const { show } = useContext(AppContext);
  return (
    <>
      <div className="border-r border-gray-600">
        {show ? (
          <div className="flex text-left flex-col gap-3 w-[90%]">
            {" "}
            {/* on Transfer */}
            <h1 className="montserrat-subheading text-[#6c8492] font-semibold text-[1.5rem]">
              Transfer
            </h1>
            <div className="py-4 montserrat-heading text-[#6c8492] flex flex-col gap-4 items-center">
              <div className="flex space-x-2 ">
                <MdVerifiedUser color="#10F1B4" size={30} />
                <p className="flex-1">
                  Safely insert the recipient's Cr address into the designated
                  field.
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser color="#10F1B4" size={30} />
                <p className="flex-1">
                  Specify the exact amount and the specific token or coin you
                  intend to transfer, ensuring a flawless transaction.
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser color="#10F1B4" size={30} />
                <p className="flex-1">
                  {" "}
                  Securely initiate transfer with "Transfer" button, ensuring
                  prompt delivery of funds to the recipient's designated
                  address.
                </p>
              </div>
            </div>
            <div className="montserrat-heading text-[#58707e]">
              <h4 className="font-semibold text-[#6c8492] text-[1.1rem]">
                29,032
              </h4>
              <p>More than 29,032 stealth addresses have been generated</p>
            </div>
          </div>
        ) : (
          <div className="flex text-left flex-col gap-3 w-[80%]">
            {" "}
            {/* on Accept */}
            <h1 className="montserrat-subheading text-[#6c8492] font-semibold text-[1.5rem]">
              Accept
            </h1>
            <div className="montserrat-heading text-[#58707e] ">
              <MdVerifiedUser color="#10F1B4" size={18} />
              <p>
                Click on the "Match" button or optionally paste your secret key
                to effortlessly retrieve your private key.
              </p>
              <MdVerifiedUser color="#10F1B4" size={18} />
              <p>
                Gain access to the specific address where the funds have been
                sent.
              </p>
            </div>
            <div className="montserrat-heading text-[#58707e] ">
              <h4 className="font-semibold text-[1.1rem]">29,032</h4>
              <p>More than 29,032 Funds have been received</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Instruction;

/*

*/
