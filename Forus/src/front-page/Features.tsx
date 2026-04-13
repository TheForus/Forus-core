import { MdPrivacyTip, MdHandshake } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import FeatureBlock from "../components/FeatureBlock";

type Props = {};

const Features = (props: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pb-16 pt-10 sm:px-8">
      <div className="space-y-2 text-left">
        <p className="montserrat-small text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cyan-400/70">
          Why Forus
        </p>
        <h1 className="montserrat-subheading text-2xl font-semibold text-slate-100 sm:text-3xl">
          Built for private, everyday transfers.
        </h1>
        <p className="montserrat-subtitle max-w-2xl text-sm text-slate-300 sm:text-base">
          Keep your address private, receive funds safely, and move fast with a familiar wallet flow.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureBlock
          heading="Stealth address shielding"
          subheading="Each transfer generates a unique destination address, making transactions harder to link or trace."
        >
          <MdPrivacyTip color="#5eead4" className="text-[34px]" />
        </FeatureBlock>
        <FeatureBlock
          heading="Simple to use"
          subheading="Generate a key, share it, and receive funds without exposing your wallet address."
        >
          <MdHandshake color="#5eead4" className="text-[34px] " />
        </FeatureBlock>
        <FeatureBlock
          heading="Secure by design"
          subheading="Encrypted key exchange and one-time addresses keep your transfers protected end to end."
        >
          <AiOutlineTransaction color="#5eead4" className="text-[34px]" />
        </FeatureBlock>
      </div>
    </div>
  );
};

export default Features;
