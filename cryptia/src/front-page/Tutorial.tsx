import React from 'react';
// import ReactPlayer from 'react-player';
import ReactPlayer from 'react-player/lazy';

type Props = {};

const Tutorial = (props: Props) => {
  return (
    <>
    <div className='flex flex-col py-10 items-center justify-center'>
      <h1 className='montserrat-heading py-4 font-semibold text-3xl
       text-[#435864] border-b border-gray-400'>See how it works</h1>
       <div className='py-5'>
       <ReactPlayer
          width='900px'
          height='460px'
          url='https://www.youtube.com/watch?v=JhqLO40y60A&t=66s'
          />
       </div>

          {/* <video width = "500" height = "300" controls>
         <source src="https://www.youtube.com/watch?v=JhqLO40y60A&t=66s" type = "video/mp4" />
         This browser doesn't support video tag.
      </video> */}
    </div>
    </>
  )
}

export default Tutorial
