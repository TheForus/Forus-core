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
    <div>
      <button onClick={handleTransferClick}>Transfer</button>
      <button onClick={handleAcceptClick}>Accept</button>

      {showTransfer ? <Transfer /> : <Accept />}
    </div>
  );
};

export default Trx;
