import { MdPrivacyTip, MdHandshake, MdNewReleases } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import FeatureBlock from "../components/FeatureBlock";

type Props = {};

const Features = (props: Props) => {
  return (
    <div className="sm:px-20 px-12 p-4 flex flex-col py-24 space-y-10 justify-center items-center">
      <h1 className="montserrat-subtitle font-extrabold py-4 text-4xl  text-[#cdd4dc]  border-b border-gray-400">
        Features and Capabilities
      </h1>{" "}
      <div
        className="md:grid flex flex-col grid-rows-3 md:grid-rows-2
             sm:grid-flow-col gap-4 "
      >
        <FeatureBlock
          heading="Enhanced Privacy Protection"
          subheading="Privacy is at the core of Forus's mission, By utilizing stealth addresses, Forus prevents anyone other than the intended recipient from tracing transactions or monitoring financial activities. The secure stealth address acts as a shield, rendering it virtually difficult for unauthorized individuals to gain insights . Forus's commitment to enhanced privacy protection sets it apart as a reliable and trustworthy platform for confidential transactions."
        >
          <MdPrivacyTip color="#cdd4dc" className="text-[60px]" />
        </FeatureBlock>
        <FeatureBlock
          heading="User-Friendly Interface"
          subheading="Forus sets itself apart by offering a user-friendly interface that prioritizes simplicity and ease of use. Its intuitive design enables both novice and experienced users to navigate the platform effortlessly. The streamlined process of generating unique addresses and initiating transactions ensures a smooth and hassle-free experience. Whether you are new to cryptocurrency or an expert, Forus's user-friendly interface guarantees a seamless and efficient transaction process."
        >
          <MdHandshake color="#cdd4dc" className="text-[60px]" />
        </FeatureBlock>
        <FeatureBlock
          heading="Secure Fund Transfer"
          subheading="Forus enables users to receive funds securely and confidentially using its state-of-the-art system. Through the utilization of stealth or secret addresses, the user can receive amount without revealing their identities or sensitive financial details. The sender generates a corresponding stealth address based on the recipient's unique forus key, ensuring that the funds are received securely and privately..."
        >
          <AiOutlineTransaction color="#cdd4dc" className="text-[60px]" />
        </FeatureBlock>
        <FeatureBlock
          heading="Unique Address Generation"
          subheading="Forus revolutionizes the way addresses are generated for transactions, ensuring unparalleled privacy and security. With its innovative one-time public key mechanism, each transaction generates a fresh and unique address. This approach eliminates the risks associated with reusing addresses and significantly reduces the chances of transaction tracing or information leaks. By employing this advanced technique, Forus provides users with a foolproof method to safeguard their financial information."
        >
          <MdNewReleases color="#cdd4dc" className="text-[60px]" />
        </FeatureBlock>
      </div>
    </div>
  );
};

export default Features;
