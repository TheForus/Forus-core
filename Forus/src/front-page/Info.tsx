import React from "react";

const Info = () => {
  return (
    <div className="flex flex-wrap mx-auto m-20 montserrat-subheading max-w-[60%] 
     items-center justify-evenly gap-4 ">
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-[1.7rem] font-bold text-black md:text-[1.9rem] xl:text-[2.6rem]">
          3
        </h2>
        <p className="text-[1rem] font-bold text-gray-500 md:text-[1.1rem]">
          Total Chains
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-[1.7rem] font-bold text-black md:text-[1.9rem] xl:text-[2.6rem]">
          TBD
        </h2>
        <p className="text-[1rem] font-bold text-gray-500 md:text-[1.1rem]">
          Total Volume
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-[1.7rem] font-bold text-black md:text-[1.9rem] xl:text-[2.6rem]">
          TBD
        </h2>
        <p className="text-[1rem] font-bold text-gray-500 md:text-[1.1rem]">
          Total Transactions
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-[1.7rem] font-bold text-black md:text-[1.9rem] xl:text-[2.6rem]">
          TBD
        </h2>
        <p className="text-[1rem] font-bold text-gray-500 md:text-[1.1rem]">
          Average Tx Time
        </p>
      </div>
    </div>
  );
};

export default Info;
