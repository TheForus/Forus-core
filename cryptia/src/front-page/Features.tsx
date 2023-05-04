import { MdPrivacyTip, MdHandshake, MdNewReleases } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import FeatureBlock from "../components/FeatureBlock";

type Props = {};

const Features = (props: Props) => {
  return (
    <>
      <div className="sm:px-20 px-12 p-4 flex flex-col py-10 space-y-10 justify-center items-center">
        <h1
          className="montserrat-heading py-4 text-3xl 
            font-semibold      text-[#435864] border-b border-gray-400 "
        >
          Features and Capabilities
        </h1>{" "}
        {/* Heading */}
        <div
          className="md:grid flex flex-col grid-rows-3 lg:grid-rows-2
             sm:grid-flow-col gap-4 "
        >
          <FeatureBlock
            heading="Enhanced Privacy Protection"
            subheading="Cryptia ensures utmost privacy by employing secure secret addresses for transactions.Transactions are conducted 
                  through a unique and anonymous 'stealth address' exclusively linked to the recipient, making it virtually impossible to trace or monitor transactions by anyone else"
          >
            <MdPrivacyTip color="#10F1B4" className="text-[60px]" />
          </FeatureBlock>
          <FeatureBlock
            heading="User-Friendly Interface"
            subheading="Cryptia offers an intuitive and user-friendly interface, enhancing the 
                  overall user experience.The interface allows for seamless navigation and ease of use, making it accessible to individuals with varying levels of technical expertise."
          >
            <MdHandshake color="#10F1B4" className="text-[60px]" />
          </FeatureBlock>
          <FeatureBlock
            heading="Secure Fund Transfer"
            subheading="Cryptia's innovative use of secure fresh addresses ensures anonymous and untraceable transactions, 
            safeguarding your funds with utmost peace of mind,are protected by advanced cryptography, ensuring unparalleled privacy and security."
          >
            <AiOutlineTransaction color="#10F1B4" className="text-[60px]" />
          </FeatureBlock>
          <FeatureBlock
            heading="Unique Address Generation"
            subheading="To initiate secure transactions, Cryptia allows users to generate a unique 'CR address' and share it with the 
                  sender.Using specific calculations, the sender can generate a corresponding 'stealth address' for receiving funds securely.."
          >
            <MdNewReleases color="#10F1B4" className="text-[60px]" />
          </FeatureBlock>
        </div>
      </div>
    </>
  );
};

export default Features;
