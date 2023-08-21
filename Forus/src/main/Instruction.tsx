import { useContext } from "react";
import { AppContext } from "./Forus";
import { MdVerifiedUser } from "react-icons/md";

type Props = {};

const Instruction = (props: Props) => {
  const { show, sumof, sumofAddress } = useContext(AppContext);
  return (
    <>
      <div className="bg-cover">
        {show ? (
          <div className="flex text-left flex-col gap-3 w-[90%]">
            {" "}
            {/* on Transfer */}
            <h1 className="montserrat-subheading  text-bgGray font-semibold text-[1.5rem]">
              Transfer
            </h1>
            <div className="py-4 montserrat-heading  text-bgGray flex flex-col gap-4 items-start">
              <div className="flex space-x-2 ">
                <MdVerifiedUser color="#cdd4dc" size={29} />
                <p className="flex-1">
                  Safely insert the recipient's "Forus key" into the designated
                  field.
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser color="#cdd4dc" size={29} />
                <p className="flex-1">
                  Specify the exact amount and the specific token or coin you
                  intend to transfer, ensuring a flawless transaction.
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser color="#cdd4dc" size={29} />
                <p className="flex-1">
                  Securely initiate funds with "Transfer" button, ensuring
                  prompt delivery of funds .
                </p>
              </div>
            </div>
            <div className="montserrat-heading  text-bgGray">
              <h4 className="font-semibold text-bgGray text-[1.1rem]">
                {sumof}
              </h4>
              <p>More than {sumof} stealth addresses have been generated</p>
            </div>
          </div>
        ) : (
          <div className="flex text-left flex-col gap-3 w-[90%]">
            {" "}
            {/* on Accept */}
            <h1 className="montserrat-subheading text-bgGray font-semibold text-[1.5rem]">
              Accept
            </h1>
            <div className="py-4 montserrat-heading  text-bgGray flex flex-col gap-4 items-center">
              <div className="flex space-x-2">
                <MdVerifiedUser color="#cdd4dc" size={29} />
                <p className="flex-1">
                  Click on the "Scan" button or optionally paste your "signature
                  key"
                </p>
              </div>
              <div className="flex space-x-2">
                <MdVerifiedUser color="#cdd4dc" size={29} />
                <p className="flex-1">
                  Gain access to the specific address where funds have been
                  sent.
                </p>
              </div>
            </div>
            <div className="montserrat-heading  text-bgGray ">
              <h4 className="font-semibold text-[1.1rem]"> {sumofAddress}</h4>
              <p>More than {sumofAddress} funds have been received</p>
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
