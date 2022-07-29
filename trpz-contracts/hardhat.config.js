require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@cronos-labs/hardhat-cronoscan")
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
      chainId: 5,
      url: ALCHEMY_API_KEY_GOERLI,
      accounts: [DEV_ACCOUNT_PRIVATE_KEY]
    },
    cronos : {
      url: "https://evm.cronos.org/",
      chainId: 25,
      accounts: [DEV_ACCOUNT_PRIVATE_KEY],
      gasPrice: 5000000000000,
    },
    cronosTestnet: {
      url: "https://cronos-testnet-3.crypto.org:8545",
      accounts: [DEV_ACCOUNT_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: { 
      goerli: ETHERSCAN_API_KEY,
      cronos: CRONOS_API_KEY,
      cronosTestnet: CRONOS_API_KEY,
    },
  }
}