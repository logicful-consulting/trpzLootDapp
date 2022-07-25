import "./styles/App.css";
import { useEffect, useState } from "react";
import {ethers, providers} from 'ethers';

import Header from "./components/Header";
import Footer from "./components/Footer";
import StakeBanner from "./components/StakeBanner";
import ClaimBanner from "./components/ClaimBanner";
import StakeFAQ from "./components/LootFAQ";
import StakeOptions from "./components/LootOptions";
import LootBoxes from "./components/LootBoxes";
import Modal from "./components/Modal";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [trpzBalance, setTrpzBalance] = useState(null);
  const [lootBalance, setLootBalance] = useState(null);
  const [bronzeBoxes, setBronzeBoxes] = useState(null);
  const [silverBoxes, setSilverBoxes] = useState(null);
  const [goldBoxes, setGoldBoxes] = useState(null);

  const [readTrpzContract, setReadTrpzContract] = useState(null);
  const [writeTrpzContract, setWriteTrpzContract] = useState(null);
  const [readGoldLootContract, setReadGoldLootContract] = useState(null);
  const [writeGoldLootContract, setWriteGoldLootContract] = useState(null);
  const [readSilverLootContract, setReadSilverLootContract] = useState(null);
  const [writeSilverLootContract, setWriteSilverLootContract] = useState(null);
  const [readBronzeLootContract, setReadBronzeLootContract] = useState(null);
  const [writeBronzeLootContract, setWriteBronzeLootContract] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [minted, setMinted] = useState(false);

  const trpzAddress ="0xa0a4f43b83971Afb63bEd3F619203AE0fb164AC7";
  const trpzABI = [
    "function name() public view returns (string memory)",
    "function balanceOf(address) public view returns (uint256)",
    "function approve(address, uint256) public returns (bool)",
    "function allowance(address, address) public view returns (uint256)",
  ]
  const goldLootAddress = "0x71E0158eC06abC632c11581292B2C041bEcc7FDe";
  const silverLootAddress = "0x5630E973f37d7e06D21A08ad0953005173f1bBDb"
  const bronzeLootAddress = "0xc0aebb7257cd7156BD01Cd46B57454c1904cfb00"
  const lootABI = [
    "function mintBox() external",
    "function balanceOf(address) public view returns (uint256)",
    "function boxCost() public view returns (uint256)",
  ]

  useEffect(() => {
    getContractInstance()
  }, [walletAddress])

  useEffect(() => {
    const getBalances = async () => {
      await getTrpzBalance()
      await getLootBalance()
    }
    getBalances()
  }, [writeBronzeLootContract])

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setSigner(signer);
      setProvider(provider);
      setWalletAddress(account);
    } catch (error) {
      console.log(error);
    }
  };

  const getContractInstance = async () => {
    const readTrpz = new ethers.Contract(trpzAddress, trpzABI, provider);
    const writeTrpz = new ethers.Contract(trpzAddress, trpzABI, signer);
    const readGoldLoot = new ethers.Contract(goldLootAddress, lootABI, provider);
    const writeGoldLoot = new ethers.Contract(goldLootAddress, lootABI, signer);
    const readSilverLoot = new ethers.Contract(silverLootAddress, lootABI, provider);
    const writeSilverLoot = new ethers.Contract(silverLootAddress, lootABI, signer);
    const readBronzeLoot = new ethers.Contract(bronzeLootAddress, lootABI, provider);
    const writeBronzeLoot = new ethers.Contract(bronzeLootAddress, lootABI, signer);
    setReadTrpzContract(readTrpz);
    setWriteTrpzContract(writeTrpz);
    setReadGoldLootContract(readGoldLoot);
    setWriteGoldLootContract(writeGoldLoot);
    setReadSilverLootContract(readSilverLoot);
    setWriteSilverLootContract(writeSilverLoot);
    setReadBronzeLootContract(readBronzeLoot);
    setWriteBronzeLootContract(writeBronzeLoot);
  }

  const getTrpzBalance = async () => {
    if(!readTrpzContract) return;
    const balance = await readTrpzContract.balanceOf(walletAddress)
    setTrpzBalance(balance.toString())
  }

  const getLootBalance = async () => {
    if(!readGoldLootContract) return;
    const bronzeBalance = (await readBronzeLootContract.balanceOf(walletAddress)).toNumber();
    setBronzeBoxes(bronzeBalance);
    const silverBalance = (await readSilverLootContract.balanceOf(walletAddress)).toNumber();
    setSilverBoxes(silverBalance);
    const goldBalance = (await readGoldLootContract.balanceOf(walletAddress)).toNumber();
    setGoldBoxes(goldBalance);
    setLootBalance(bronzeBalance + silverBalance + goldBalance)
  }

  const mintBronze = async () => {
    if(!writeBronzeLootContract) return;
    if(await readTrpzContract.allowance(walletAddress, bronzeLootAddress) < ((await readBronzeLootContract.boxCost()).toNumber() * 10)) {
      const allowTx = await writeTrpzContract.approve(bronzeLootAddress, (await readBronzeLootContract.boxCost()).toNumber() * 200);
      alert("Waiting for the tx to confirm. Then the mint transaction will pop-up.")
      await allowTx.wait()
    }
    try{
      const tx = await writeBronzeLootContract.mintBox();
      setOpenModal(true);
      await tx.wait();
      setMinted(true);
    }
    catch(error) {
      alert("Something went wrong. Please try again.")
    }
  };

  const mintSilver = async () => {
    if(!writeSilverLootContract) return;
    if(await readTrpzContract.allowance(walletAddress, silverLootAddress) < ((await readSilverLootContract.boxCost()).toNumber() * 10)) {
      const allowTx = await writeTrpzContract.approve(silverLootAddress, (await readSilverLootContract.boxCost()).toNumber() * 200);
      alert("Waiting for the tx to confirm. Then the mint transaction will pop-up.")
      await allowTx.wait()
    }
    try{
      const tx = await writeSilverLootContract.mintBox();
      setOpenModal(true);
      await tx.wait();
      setMinted(true);
    }
    catch(error) {
      alert("Something went wrong. Please try again.")
    }
  };

  const mintGold = async () => {
    if(!writeGoldLootContract) return;
    if(await readTrpzContract.allowance(walletAddress, goldLootAddress) < ((await readGoldLootContract.boxCost()).toNumber() * 10)) {
      const allowTx = await writeTrpzContract.approve(goldLootAddress, (await readGoldLootContract.boxCost()).toNumber() * 200);
      alert("Waiting for the tx to confirm. Then the mint transaction will pop-up.")
      await allowTx.wait()
    }
    try {
      const tx = await writeGoldLootContract.mintBox();
      setOpenModal(true);
      await tx.wait();
      setMinted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.")
    }
  };

  function closeModal() {
    setOpenModal(false);
    setMinted(false);
  }

  return (
    <div className="App">
      <Header 
      connectWallet={connectWallet}
      walletAddress={walletAddress}
      />
      <StakeBanner 
      trpzBalance = {trpzBalance}
      lootBalance = {lootBalance}
      />
      {lootBalance> 0 && 
      <ClaimBanner
      bronzeBoxes = {bronzeBoxes}
      silverBoxes = {silverBoxes}
      goldBoxes = {goldBoxes}
      />
      }
      {openModal && 
      <Modal 
      closeModal={closeModal}
      minted={minted}
      />
      }
      <LootBoxes
        mintBronze={mintBronze}
        mintSilver={mintSilver}
        mintGold={mintGold}
      />
      <StakeOptions />
      <StakeFAQ />
      <Footer />
    </div>
  );
}

export default App;
