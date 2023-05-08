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
          className="montserrat-heading py-4 font-semibold text-3xl
       text-[#435864] dark:text-gray-100 border-b border-gray-400"
        >
          See how it works
        </h1>
        <div className="py-5 flex justify-center md:h-[580px] h-[300px] xl:w-[60%] w-full">
          <ReactPlayer
            width="90%"
            height="95%"
            url="https://www.youtube.com/watch?v=sN-ROIAtt04"
          />
        </div>

        {/* <video width = "500" height = "300" controls>
         <source src="https://www.youtube.com/watch?v=JhqLO40y60A&t=66s" type = "video/mp4" />
         This browser doesn't support video tag.
      </video> */}
      </div>
    </>
  );
};

export default Tutorial;
