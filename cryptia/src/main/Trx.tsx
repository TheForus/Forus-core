import React, { useState } from 'react';
import Transfer from './Transfer';
import Accept from './Accept';

import { useContext } from 'react';
import { AppContext } from './Cryptia';

type Props = {};

const Trx = (props: Props) => {
  const {setShow}=useContext(AppContext);
  const [showTransfer, setShowTransfer] = useState(true);

  const handleTransferClick = () => {
    setShowTransfer(true);
    setShow(true);
  };

  const handleAcceptClick = () => {
    setShowTransfer(false);
    setShow(false);
  };

  return (
    <div className='flex flex-col p-5 backdrop-blur-[50px] hover:backdrop-blur-lg
     h-full'>
      <div className='flex space-x-4 montserrat-subtitle text-xl 
      border-b pb-2 border-gray-300
      font-bold'>
        <button 
        onClick={handleTransferClick}
        className={`px-3 
        text-${showTransfer ? '[#10F1B4]' : 'gray-900'}`}
        >Transfer</button>
        <button 
        onClick={handleAcceptClick}
        className={`px-3 
        text-${!showTransfer ? '[#10F1B4]' : 'gray-900'}`}
        >Accept</button>
      </div>
      {/* below buttons */}
      <div className='p-4'>
      {showTransfer ? <Transfer /> : <Accept />}
      </div>
    </div>
  );
};

export default Trx;
