import React from "react";

type Props = {
  heading: string;
  subheading: string;
  children: React.ReactNode;
};

const FeatureBlock = (props: Props) => {
  return (
    <>
      <div className="cursor-default rounded-2xl border border-slate-700/70 bg-slate-900/60 p-6 text-left shadow-[0_12px_40px_rgba(8,15,25,0.35)]">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center">{props.children}</div>
          <h4 className="montserrat-subheading min-h-[2.5rem] text-[1.05rem] font-semibold leading-snug text-slate-100 sm:text-xl">
            {props.heading}
          </h4>
        </div>
        <p className="montserrat-small mt-3 text-sm leading-6 text-slate-300 sm:text-[0.98rem]">
          {props.subheading}
        </p>
      </div>
    </>
  );
};

export default FeatureBlock;
