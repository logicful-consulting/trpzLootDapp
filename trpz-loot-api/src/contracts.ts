import { config } from "./config";
import { Contract, ethers } from "ethers";
import { BoxType } from "./types";

const abi = ["function ownerOf(uint256) public view returns (address)"];
const provider = new ethers.providers.JsonRpcProvider(config.eth.rpcUrl);
const [bronzeContract, silverContract, goldContract] = [
  config.eth.bronzeContractAddress,
  config.eth.silverContractAddress,
  config.eth.goldContractAddress,
].map((contractAddress) => new ethers.Contract(contractAddress, abi, provider));

export const boxTypeToContract: { [key in BoxType]: Contract } = {
  [BoxType.BRONZE]: bronzeContract,
  [BoxType.SILVER]: silverContract,
  [BoxType.GOLD]: goldContract,
};
