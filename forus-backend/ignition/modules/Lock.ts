// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


module.exports = buildModule("safeMath", (m : any) => {

   const safeMath = m.contract("SafeMath");
  return { safeMath};

});



module.exports = buildModule("logs", (m : any) => {


  const logs = m.contract("Logs");

  return { logs};

});


