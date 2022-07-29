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
import dayjs from "dayjs";
import { useMoralisWeb3Api } from "react-moralis";
import ClipLoader from "react-spinners/ClipLoader"
import LootBanner from "./components/LootBanner";

function App() {
  const Web3Api = useMoralisWeb3Api();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [trpzBalance, setTrpzBalance] = useState(null);
  const [lootBalance, setLootBalance] = useState(null);
  const [bronzeBoxes, setBronzeBoxes] = useState(null);
  const [bronzeBoxArray, setBronzeBoxArray] = useState([]);
  const [silverBoxes, setSilverBoxes] = useState(null);
  const [silverBoxArray, setSilverBoxArray] = useState([]);
  const [goldBoxes, setGoldBoxes] = useState(null);
  const [goldBoxArray, setGoldBoxArray] = useState([]);
  const [bronzeTime, setBronzeTime] = useState(null);
  const [silverTime, setSilverTime] = useState(null);
  const [goldTime, setGoldTime] = useState(null);
  const [bronzeURI, setBronzeURI] = useState(null);
  const [silverURI, setSilverURI] = useState(null);
  const [goldURI, setGoldURI] = useState(null);
  const [bronzeLeft, setBronzeLeft] = useState(null);
  const [silverLeft, setSilverLeft] = useState(null);
  const [goldLeft, setGoldLeft] = useState(null);

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
  const [claimed, setClaimed] = useState(false);
  const [claimingBox, setClaimingBox] = useState(null);
  const [loading, setLoading] = useState(false);

  const adminAddress = "0xF545eDA04d42046B000d833F26dA9454657ac581";
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
    "function safeTransferFrom(address, address, uint256) public returns (bool)",
    "function boxesAvailable() public view returns (uint64)",
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
    providerOptions,
  });

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
      setLoading(true);
      await getTokenIds();
      await getURIs();
      getLootInfo()
      getTimers();
      setLoading(false);
    };
    getInfo();
  }, [lootBalance]);

  useEffect(() => {}, 1000);

  const connectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      const provider = await web3Modal.connect();
      const library = new providers.Web3Provider(provider);
      const { chainId } = await library.getNetwork();
      if (chainId !== 5) {
        alert("Use Cronos network to connect");
      }
      const accounts = await library.listAccounts();
      const signer = await library.getSigner();
      setSigner(signer);
      setProvider(library);
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
    if (!readGoldLootContract) return;
    if (!readSilverLootContract) return;
    if (!readBronzeLootContract) return;
    const goldURI = await readGoldLootContract.tokenURI(1);
    const silverURI = await readSilverLootContract.tokenURI(1);
    const bronzeURI = await readBronzeLootContract.tokenURI(1);
    setGoldURI(goldURI);
    setSilverURI(silverURI);
    setBronzeURI(bronzeURI);
  };

  const getLootInfo = async () => {
    if (!readGoldLootContract) return;
    if (!readSilverLootContract) return;
    if (!readBronzeLootContract) return;
    const bronzeLeft = await readBronzeLootContract.boxesAvailable();
    const silverLeft = await readSilverLootContract.boxesAvailable();
    const goldLeft = await readGoldLootContract.boxesAvailable();
    setBronzeLeft(bronzeLeft.toNumber())
    setSilverLeft(silverLeft.toNumber())
    setGoldLeft(goldLeft.toNumber())
  }

  const getTokenIds = async () => {
    try {
      if (bronzeBoxes > 0) {
        const options = {
          chain: "goerli",
          address: walletAddress,
          token_address: bronzeLootAddress,
        };
        let NFTs = await Web3Api.account.getNFTsForContract(options);
        let bronzeObjects = [];
        for(let i = 0; i < NFTs.result.length; i++) {
          bronzeObjects.push(NFTs.result[i].token_id);
        }
        setBronzeBoxArray(bronzeObjects);
        console.log(bronzeObjects);
      }
      if (silverBoxes > 0) {
        const options = {
          chain: "goerli",
          address: walletAddress,
          token_address: silverLootAddress,
        };
        let NFTs = await Web3Api.account.getNFTsForContract(options);
        let silverObjects = [];
        for(let i = 0; i < NFTs.result.length; i++) {
          silverObjects.push(NFTs.result[i].token_id);
        }
        setSilverBoxArray(silverObjects);
        console.log(silverObjects);
      }
      if (goldBoxes > 0) {
        const options = {
          chain: "goerli",
          address: walletAddress,
          token_address: goldLootAddress,
        };
        let NFTs = await Web3Api.account.getNFTsForContract(options);
        let goldObjects = [];
        for(let i = 0; i < NFTs.result.length; i++) {
          goldObjects.push(NFTs.result[i].token_id);
        }
        setGoldBoxArray(goldObjects);
        console.log(goldObjects);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimLoot = async (boxType, tokenId) => {
    setClaimed(false);
    if (boxType === "bronze") {
      console.log("Started bronze: ", tokenId);
      const writeBronzeContract = new ethers.Contract(
        bronzeLootAddress,
        lootABI,
        signer
      );
      const tx = await writeBronzeContract.safeTransferFrom(
        walletAddress,
        adminAddress,
        tokenId
      );
      alert("Waiting for transaction to be completed. Please wait a second...");
      await tx.wait();
      alert("You've successfully claimed a Bronze Box! Your reward is ...");
      window.location.reload();
    } else if (boxType === "silver") {
      console.log("Started silver: ", tokenId);
      const writeSilverContract = new ethers.Contract(
        silverLootAddress,
        lootABI,
        signer
      );
      const tx = await writeSilverContract.safeTransferFrom(
        walletAddress,
        adminAddress,
        tokenId
      );
      alert("Waiting for transaction to be completed. Please wait a second...");
      await tx.wait();
      alert("You've successfully claimed a Bronze Box! Your reward is ...");
      window.location.reload()
    } else {
      console.log("Started gold: ", tokenId);
      const writeGoldContract = new ethers.Contract(
        goldLootAddress,
        lootABI,
        signer
      );
      const tx = await writeGoldContract.safeTransferFrom(
        walletAddress,
        adminAddress,
        tokenId
      );
      alert("Waiting for transaction to be completed. Please wait a second...");
      await tx.wait();
      alert("You've successfully claimed a Bronze Box! Your reward is ...");
      window.location.reload()
    }
  };

  const getTimers = async () => {
    if (!readGoldLootContract) return;
    if (!readSilverLootContract) return;
    if (!readBronzeLootContract) return;
    // const bronzeTimer = await readBronzeLootContract.addressCooldown();
    // console.log(bronzeTimer);
    startTimer();
  };

  const mintBronze = async () => {
    if (!writeBronzeLootContract) return;
    if(!readBronzeLootContract) return;
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
      setClaimingBox("silver")
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

  // Timer logic 2
  const [timerMinutes, setTimerMinutes] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(null);

  let interval; 
  const startTimer = () => {
    const countDownDate = new Date("July 31, 2022").getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if(distance < 0) {
        clearInterval(interval.current);
        setTimerMinutes("00");
        setTimerSeconds("00");
      } else {
        setTimerMinutes(minutes);
        if(minutes < 10) {
          setTimerMinutes("0" + minutes);
        }
        setTimerSeconds(0 + seconds);
        if(seconds < 10) {
          setTimerSeconds("0" + seconds);
        }
      }
    })
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
      {loading ? <ClipLoader color={'#D0021B'} loading={loading} size ={150} />
      :
      <ClaimBoxes
        bronzeBoxes={bronzeBoxes}
        bronzeBoxArray={bronzeBoxArray}
        silverBoxes={silverBoxes}
        silverBoxArray={silverBoxArray}
        goldBoxes={goldBoxes}
        goldBoxArray={goldBoxArray}
        claimLoot={claimLoot}
      />
      }
      {openModal && <Modal 
      closeModal={closeModal} 
      minted={minted} 
      claimingBox={claimingBox}
      claimLoot={claimLoot}
      />}
      <LootBanner/>
      <LootBoxes
        mintBronze={mintBronze}
        bronzeTime={bronzeTime}
        mintSilver={mintSilver}
        mintGold={mintGold}
        timerMinutes={timerMinutes}
        timerSeconds={timerSeconds}
        bronzeLeft={bronzeLeft}
        silverLeft={silverLeft}
        goldLeft={goldLeft}
      />
      <StakeOptions />
      <StakeFAQ />
      <Footer />
    </div>
  );
}

export default App;
