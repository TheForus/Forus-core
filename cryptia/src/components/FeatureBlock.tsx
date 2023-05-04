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
        className="cursor-default max-w-[500px] bg-[#e8fdf4] p-3 py-10 md:py-5 rounded-md flex flex-col
         space-y-4 items-center"
      >
        <div className="flex space-y-5 md:flex-col items-center">
          {props.children}
          <h4
            className="montserrat-subheading 
            text-[#394c57] md:text-xl text-lg font-extrabold mb-2"
          >
            {props.heading}
          </h4>
        </div>
        {/* <i>privacy</i> */}
        <p
          className="leading-6 text-gray-800 w-[75%] md:text-md text-base 
            font-semibold montserrat-small"
        >
          {props.subheading}
        </p>
      </div>
    </>
  );
};

export default FeatureBlock;
