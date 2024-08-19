const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("safeMath", (m : any) => {

   const safeMath = m.contract("SafeMath");
  return { safeMath};

});



module.exports = buildModule("logs", (m : any) => {


  const logs = m.contract("Logs");

  return { logs};

});


