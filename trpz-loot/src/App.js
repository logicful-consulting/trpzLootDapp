import "./styles/App.css";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";

import Header from "./components/Header";
import Footer from "./components/Footer";
import StakeBanner from "./components/StakeBanner";
import ClaimBoxes from "./components/ClaimBoxes";
import StakeFAQ from "./components/LootFAQ";
import StakeOptions from "./components/LootOptions";
import LootBoxes from "./components/LootBoxes";
import LootStats from "./components/LootStats";
import Modal from "./components/Modal";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import dayjs from 'dayjs';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [trpzBalance, setTrpzBalance] = useState(null);
  const [lootBalance, setLootBalance] = useState(null);
  const [bronzeBoxes, setBronzeBoxes] = useState(null);
  const [silverBoxes, setSilverBoxes] = useState(null);
  const [goldBoxes, setGoldBoxes] = useState(null);
  const [bronzeTime, setBronzeTime] = useState(null);
  const [silverTime, setSilverTime] = useState(null);
  const [goldTime, setGoldTime] = useState(null);
  const [bronzeURI, setBronzeURI] = useState(null);
  const [silverURI, setSilverURI] = useState(null);
  const [goldURI, setGoldURI] = useState(null);
  const [remainingTime, setRemainingTime] = useState("00:00");

  const updateRemainingTime = (countdown) => {
    setRemainingTime(getRemainingTime(countdown));
  }

  const getRemainingTime = (timestamp) => {
    const timestampDayjs = dayjs(timestamp)
    const nowDayjs = dayjs()
    return {
      seconds: getRemainingSeconds(nowDayjs, timestampDayjs),
      minutes: getRemainingMinutes(nowDayjs, timestampDayjs),
    }
  }

  const getRemainingSeconds = (nowDayjs, timestampDayjs) => {
    const seconds = timestampDayjs.diff(nowDayjs, 'seconds') % 60;
    return padWithZero(seconds, 2);
  }

  const getRemainingMinutes = (nowDayjs, timestampDayjs) => {
    const minutes = timestampDayjs.diff(nowDayjs, 'minutes') % 60;
    return padWithZero(minutes, 2);
  }

  const padWithZero = (number, minLength) => {
    const numberString = number.toString()
    if(numberString.length >= minLength) return numberString;
    return "0".repeat(minLength - numberString.length) + numberString;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(2210214000000)
    }, 1000);
    return() => clearInterval(intervalId);
  }, []);

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

  const adminAddress = ""
  const trpzAddress = "0xa0a4f43b83971Afb63bEd3F619203AE0fb164AC7";
  const trpzABI = [
    "function name() public view returns (string memory)",
    "function balanceOf(address) public view returns (uint256)",
    "function approve(address, uint256) public returns (bool)",
    "function allowance(address, address) public view returns (uint256)",
  ];
  const goldLootAddress = "0x71E0158eC06abC632c11581292B2C041bEcc7FDe";
  const silverLootAddress = "0x5630E973f37d7e06D21A08ad0953005173f1bBDb";
  const bronzeLootAddress = "0xc0aebb7257cd7156BD01Cd46B57454c1904cfb00";
  const lootABI = [
    "function mintBox() external",
    "function balanceOf(address) public view returns (uint256)",
    "function boxCost() public view returns (uint256)",
    "function tokenURI(uint256) public view returns (string)",
    "function transfer(address, uint256) public returns (bool)",
  ];

  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        rpc: {
          25: "https://evm.cronos.org/",
        },
        chainId: 25,
        network: "cronos",
        qrcode: true,
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "cronos",
    providerOptions
})

  useEffect(() => {
    getContractInstance();
  }, [walletAddress]);

  useEffect(() => {
    const getBalances = async () => {
      await getTrpzBalance();
      await getLootBalance();
    };
    getBalances();
  }, [writeBronzeLootContract]);

  useEffect(() => {
    const getInfo = async () => {
      await getURIs();
      await getTimers()
    };
    getInfo();
  }, [lootBalance]);

  useEffect(() => {
  
  }, 1000);

  const connectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider()
      const provider = await web3Modal.connect();
      const library = new providers.Web3Provider(provider);
      const {chainId} = await library.getNetwork()
      if (chainId !== 5) {
          alert("Use Cronos network to connect")
      }
      const accounts = await library.listAccounts();
      const signer = await library.getSigner()
      setSigner(signer)
      setProvider(library)
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getContractInstance = async () => {
    const readTrpz = new ethers.Contract(trpzAddress, trpzABI, provider);
    const writeTrpz = new ethers.Contract(trpzAddress, trpzABI, signer);
    const readGoldLoot = new ethers.Contract(
      goldLootAddress,
      lootABI,
      provider
    );
    const writeGoldLoot = new ethers.Contract(goldLootAddress, lootABI, signer);
    const readSilverLoot = new ethers.Contract(
      silverLootAddress,
      lootABI,
      provider
    );
    const writeSilverLoot = new ethers.Contract(
      silverLootAddress,
      lootABI,
      signer
    );
    const readBronzeLoot = new ethers.Contract(
      bronzeLootAddress,
      lootABI,
      provider
    );
    const writeBronzeLoot = new ethers.Contract(
      bronzeLootAddress,
      lootABI,
      signer
    );
    setReadTrpzContract(readTrpz);
    setWriteTrpzContract(writeTrpz);
    setReadGoldLootContract(readGoldLoot);
    setWriteGoldLootContract(writeGoldLoot);
    setReadSilverLootContract(readSilverLoot);
    setWriteSilverLootContract(writeSilverLoot);
    setReadBronzeLootContract(readBronzeLoot);
    setWriteBronzeLootContract(writeBronzeLoot);
  };

  const getTrpzBalance = async () => {
    if (!readTrpzContract) return;
    const balance = await readTrpzContract.balanceOf(walletAddress);
    setTrpzBalance(balance.toString());
  };

  const getLootBalance = async () => {
    if (!readGoldLootContract) return;
    const bronzeBalance = (
      await readBronzeLootContract.balanceOf(walletAddress)
    ).toNumber();
    setBronzeBoxes(bronzeBalance);
    const silverBalance = (
      await readSilverLootContract.balanceOf(walletAddress)
    ).toNumber();
    setSilverBoxes(silverBalance);
    const goldBalance = (
      await readGoldLootContract.balanceOf(walletAddress)
    ).toNumber();
    setGoldBoxes(goldBalance);
    setLootBalance(bronzeBalance + silverBalance + goldBalance);
  };

  const getURIs = async () => {
    if(!readGoldLootContract) return;
    if(!readSilverLootContract) return;
    if(!readBronzeLootContract) return;
    console.log("Running get URI")
    const goldURI = await readGoldLootContract.tokenURI(1);
    const silverURI = await readSilverLootContract.tokenURI(1);
    const bronzeURI = await readBronzeLootContract.tokenURI(1);
    setGoldURI(goldURI);
    setSilverURI(silverURI);
    setBronzeURI(bronzeURI);
  }

  const claimLoot = async (boxType, tokenId) => {
    let boxAddress;
    if(boxType === "bronze") {
      const writeBronzeContract = new ethers.Contract(bronzeLootAddress, lootABI, signer);
      const tx = await writeBronzeContract.transfer(walletAddress, adminAddress, tokenId);
      alert("Waiting for transaction to be mined...");
      await tx.wait();
    } else if(boxType === "silver") {

    } else {

    }
  }

  const getTimers = async () => {
    if(!readGoldLootContract) return;
    if(!readSilverLootContract) return;
    if(!readBronzeLootContract) return;
    const bronzeTimer = await readBronzeLootContract.addressCooldown();
    console.log(bronzeTimer)
  }

  const mintBronze = async () => {
    if (!writeBronzeLootContract) return;
    if (
      (await readTrpzContract.allowance(walletAddress, bronzeLootAddress)) <
      (await readBronzeLootContract.boxCost()).toNumber() * 10
    ) {
      const allowTx = await writeTrpzContract.approve(
        bronzeLootAddress,
        (await readBronzeLootContract.boxCost()).toNumber() * 200
      );
      alert(
        "Waiting for the tx to confirm. Then the mint transaction will pop-up."
      );
      await allowTx.wait();
    }
    try {
      const tx = await writeBronzeLootContract.mintBox();
      setOpenModal(true);
      await tx.wait();
      setMinted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const mintSilver = async () => {
    if (!writeSilverLootContract) return;
    if (
      (await readTrpzContract.allowance(walletAddress, silverLootAddress)) <
      (await readSilverLootContract.boxCost()).toNumber() * 10
    ) {
      const allowTx = await writeTrpzContract.approve(
        silverLootAddress,
        (await readSilverLootContract.boxCost()).toNumber() * 200
      );
      alert(
        "Waiting for the tx to confirm. Then the mint transaction will pop-up."
      );
      await allowTx.wait();
    }
    try {
      const tx = await writeSilverLootContract.mintBox();
      setOpenModal(true);
      await tx.wait();
      setMinted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const mintGold = async () => {
    if (!writeGoldLootContract) return;
    if (
      (await readTrpzContract.allowance(walletAddress, goldLootAddress)) <
      (await readGoldLootContract.boxCost()).toNumber() * 10
    ) {
      const allowTx = await writeTrpzContract.approve(
        goldLootAddress,
        (await readGoldLootContract.boxCost()).toNumber() * 200
      );
      alert(
        "Waiting for the tx to confirm. Then the mint transaction will pop-up."
      );
      await allowTx.wait();
    }
    try {
      const tx = await writeGoldLootContract.mintBox();
      setOpenModal(true);
      await tx.wait();
      setMinted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  function closeModal() {
    setOpenModal(false);
    setMinted(false);
  }

  return (
    <div className="App">
      <Header connectWallet={connectWallet} walletAddress={walletAddress} />
      <StakeBanner trpzBalance={trpzBalance} lootBalance={lootBalance} />
      <LootStats 
      bronzeBoxes={bronzeBoxes}
      silverBoxes={silverBoxes}
      goldBoxes={goldBoxes}
      />
      <ClaimBoxes
      bronzeBoxes={bronzeBoxes}
      silverBoxes={silverBoxes}
      goldBoxes={goldBoxes}
      
      />
      {openModal && <Modal closeModal={closeModal} minted={minted} />}
      <LootBoxes
        mintBronze={mintBronze}
        bronzeTime={bronzeTime}
        mintSilver={mintSilver}
        mintGold={mintGold}
        remainingTime={remainingTime}
      />
      <StakeOptions />
      <StakeFAQ />
      <Footer />
    </div>
  );
}

export default App;
