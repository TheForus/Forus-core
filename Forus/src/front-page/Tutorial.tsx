import React from "react";
// import ReactPlayer from 'react-player';
import ReactPlayer from "react-player/lazy";

type Props = {};

const Tutorial = (props: Props) => {
  return (
    <>
      <div
        id="howitworks"
        className="flex flex-col py-10 items-center justify-center"
      >
        <h1
          className="montserrat-subtitle py-4 font-semibold text-4xl
          text-bgGray d border-b border-gray-400"
        >
          See how it works
        </h1>
        <div className="py-5 flex justify-center md:h-[580px] h-[300px] xl:w-[60%] w-full">
          <ReactPlayer
            width="90%"
            height="95%"
            controls={true}
            url="https://youtu.be/LPRhcdHKfKg"
          />
        </div>
      </div>
    </>
  );
};

export default Tutorial;
