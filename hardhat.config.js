/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("@nomicfoundation/hardhat-toolbox");

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
/*module.exports = {
   solidity: "0.8.1",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
   etherscan: {
      apiKey: ETHERSCAN_API_KEY
    }   
}*/

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
      hardhat: {},
  }
//  defaultNetwork: 'localhost'
};