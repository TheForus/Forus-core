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
        className="cursor-default max-w-[650px] bg-[#e8fdf4] dark:bg-[#1f1e1e] p-3 py-10 md:py-5 rounded-md flex flex-col
         space-y-4 items-center"
      >
        <div className="flex space-y-5 md:flex-col items-center">
          {props.children}
          <h4
            className="montserrat-subheading 
            text-[#394c57] dark:text-[#05cf93] md:text-xl text-lg font-extrabold mb-2"
          >
            {props.heading}
          </h4>
        </div>
        {/* <i>privacy</i> */}
        <p
          className="leading-6 text-gray-800 dark:text-gray-400 w-[75%] md:text-md text-base 
            font-semibold montserrat-small"
        >
          {props.subheading}
        </p>
      </div>
    </>
  );
};

export default FeatureBlock;
