require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",

  networks:{
    hardhat: {},
    sepolia:{
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    auroraTestnet: {
      url: `https://testnet.aurora.dev`,
      accounts: [process.env.PRIVATE_KEY],
    },
  }
};
