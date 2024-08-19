import React from "react";

type Props = {
  heading: string;
  subheading: string;
  children: React.ReactNode;
};

const FeatureBlock = (props: Props) => {
  return (
    <>
      <div
        className="cursor-default max-w-[650px] bg-[#d7d7e1]  p-3 py-10 md:py-5 rounded-md flex flex-col
         space-y-4 items-center"
      >
        <div className="flex space-y-5 md:flex-col items-center">
          {props.children}
          <h4
            className="montserrat-subheading 
            text-gray-700  md:text-2xl text-xl font-extrabold mb-2"
          >
            {props.heading}
          </h4>
        </div>
        {/* <i>privacy</i> */}
        <p
          className="leading-6  w-[75%] md:text-md text-base text-gray-500 
            font-light montserrat-subheading"
        >
          {props.subheading}
        </p>
      </div>
    </>
  );
};

export default FeatureBlock;
