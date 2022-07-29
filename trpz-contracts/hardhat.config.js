require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({ path: ".env" });

const ALCHEMY_API_KEY_GOERLI = process.env.ALCHEMY_API_KEY_GOERLI
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const CRONOS_API_KEY = process.env.CRONOS_API_KEY;
const DEV_ACCOUNT_PRIVATE_KEY = process.env.DEV_ACCOUNT_PRIVATE_KEY

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY_GOERLI,
      accounts: [DEV_ACCOUNT_PRIVATE_KEY]
    },
    cronos : {
      url: "https://evm.cronos.org/",
      chainId: 25,
      accounts: [DEV_ACCOUNT_PRIVATE_KEY],
      gasPrice: 5000000000000,
    },
    cronos_testnet: {
      url: "https://evm-t3.cronos.org/",
      accounts: [DEV_ACCOUNT_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: { 
      goerli: ETHERSCAN_API_KEY,
    },
  }
}