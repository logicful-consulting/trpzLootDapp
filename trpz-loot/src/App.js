import "./styles/App.css";
import { useEffect, useState } from "react";
import { ethers, providers } from "ethers";

import Header from "./components/Header";
import Footer from "./components/Footer";
import StakeBanner from "./components/StakeBanner";
import ClaimBoxes, { LOOT_API_URL } from "./components/ClaimBoxes";
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
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [claimingLoot, setClaimingLoot] = useState(false);
  const [claimedLoot, setClaimedLoot] = useState({});
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
  const goldLootAddress = "0x70Fa4308686d6d4587443478bC39EDB5105dcc84";
  const silverLootAddress = "0x68FEe038CF321539c0A365BBB995796A63ead3d3";
  const bronzeLootAddress = "0xF7d4F29caF0F8454D0Cc3f847683e43C7a1FB20a";
  const lootABI = [
    "function mintBox() external",
    "function balanceOf(address) public view returns (uint256)",
    "function boxCost() public view returns (uint256)",
    "function tokenURI(uint256) public view returns (string)",
    "function safeTransferFrom(address, address, uint256) public returns (bool)",
    "function boxesAvailable() public view returns (uint64)",
    "function addressCooldown(address) public view returns (uint256)",
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
    // const goldURI = await readGoldLootContract.tokenURI(1);
    // const silverURI = await readSilverLootContract.tokenURI(1);
    // const bronzeURI = await readBronzeLootContract.tokenURI(1);
    // setGoldURI(goldURI);
    // setSilverURI(silverURI);
    // setBronzeURI(bronzeURI);
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
        setBronzeBoxArray(bronzeObjects.reverse());
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
        setSilverBoxArray(silverObjects.reverse());
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
        setGoldBoxArray(goldObjects.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const claimLoot = async (boxType, tokenId, address) => {
    try {
      setClaimingLoot(true);
      const response = await fetch(LOOT_API_URL, {
        method: 'POST',
        body: JSON.stringify({
          boxType, tokenId, address
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json();
      setClaimedLoot(data)
      return data
    } catch (error) {
      console.log(error)
      alert("Something went wrong. Please try again.");
      setClaimingLoot(false);
    }
  };

  const getTimers = async () => {
    if (!readGoldLootContract) return;
    if (!readSilverLootContract) return;
    if (!readBronzeLootContract) return;
    const bronzeTimer = await readBronzeLootContract.addressCooldown(walletAddress);
    const bronzeTime = new Date(bronzeTimer.toNumber() * 1000);
    const silverTimer = await readSilverLootContract.addressCooldown(walletAddress);
    const silverTime = new Date(silverTimer.toNumber() * 1000);
    const goldTimer = await readGoldLootContract.addressCooldown(walletAddress);
    const goldTime = new Date(goldTimer.toNumber() * 1000);
    startTimer(bronzeTime.getTime(), silverTime.getTime(), goldTime.getTime());
    startSilverTimer(silverTime.getTime());
    startGoldTimer(goldTime.getTime());
  };

    // Timer logic 2
    const [bronzeTimerMinutes, setBronzeTimerMinutes] = useState(null);
    const [bronzeTimerSeconds, setBronzeTimerSeconds] = useState(null);
    const [silverTimerMinutes, setSilverTimerMinutes] = useState(null);
    const [silverTimerSeconds, setSilverTimerSeconds] = useState(null);
    const [goldTimerMinutes, setGoldTimerMinutes] = useState(null);
    const [goldTimerSeconds, setGoldTimerSeconds] = useState(null);
  
    let interval; 
    const startTimer = (date) => {
      interval = setInterval(() => {
        const distance = date - new Date().getTime();
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(distance < 0) {
          clearInterval(interval.current);
          setBronzeTimerMinutes("00")
          setBronzeTimerSeconds("00")
        }
        else {
          if(minutes < 10) {
            setBronzeTimerMinutes("0" + minutes);
          } else {
          setBronzeTimerMinutes(minutes);
          }
          if(seconds < 10) {
            setBronzeTimerSeconds("0" + seconds);
          } else {
          setBronzeTimerSeconds(0 + seconds);
          }
        }
      })
    }

    const startSilverTimer = (date) => {
      interval = setInterval(() => {
        const distance = date - new Date().getTime();
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(distance < 0) {
          clearInterval(interval.current);
          setSilverTimerMinutes("00")
          setSilverTimerSeconds("00")
        }
        else {
          if(minutes < 10) {
            setSilverTimerMinutes("0" + minutes);
          } else {
          setSilverTimerMinutes(minutes);
          }
          if(seconds < 10) {
            setSilverTimerSeconds("0" + seconds);
          } else {
          setSilverTimerSeconds(seconds);
          }
        }
      })
    }

    const startGoldTimer = (date) => {
      interval = setInterval(() => {
        const distance = date - new Date().getTime();
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(distance < 0) {
          clearInterval(interval.current);
          setGoldTimerMinutes("00")
          setGoldTimerSeconds("00")
        }
        else {
          if(minutes < 10) {
            setGoldTimerSeconds("0" + seconds);
          } else {
            setGoldTimerMinutes(minutes);
          }
          if(seconds < 10) {
            setGoldTimerSeconds("0" + seconds);
          } else {
          setGoldTimerSeconds(seconds);
          }
        }
      })
    }

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
      setClaimingBox("bronze")
      const receipt = await tx.wait();
      const topic = receipt.logs[0].topics[3];
      console.log(receipt)
      const tokenId = parseInt(Number(topic));
      setMinted(true);
      setMintedTokenId(tokenId)
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
      const receipt = await tx.wait();
      const topic = receipt.logs[0].topics[3];
      console.log(receipt)
      const tokenId = parseInt(Number(topic));
      setMinted(true);
      setMintedTokenId(tokenId)
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
      setClaimingBox("gold")
      const receipt = await tx.wait();
      const topic = receipt.logs[0].topics[3];
      console.log(receipt)
      const tokenId = parseInt(Number(topic));
      setMinted(true);
      setMintedTokenId(tokenId)
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  function closeModal() {
    setOpenModal(false);
    setMinted(false);
    setClaimedLoot({});
    setClaimingLoot(false);
    setClaimingBox(null);
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
        walletAddress={walletAddress}
      />
      }
      {openModal && <Modal 
      closeModal={closeModal} 
      minted={minted} 
      claimingBox={claimingBox}
      claimingLoot={claimingLoot}
      claimedLoot={claimedLoot}
      claimLoot={claimLoot}
      walletAddress={walletAddress}
      mintedTokenId={mintedTokenId}
      setClaimedLoot={setClaimedLoot}
        />}
      <LootBanner/>
      <LootBoxes
        mintBronze={mintBronze}
        bronzeTime={bronzeTime}
        mintSilver={mintSilver}
        mintGold={mintGold}
        bronzeTimerMinutes={bronzeTimerMinutes}
        bronzeTimerSeconds={bronzeTimerSeconds}
        silverTimerMinutes={silverTimerMinutes}
        silverTimerSeconds={silverTimerSeconds}
        goldTimerMinutes={goldTimerMinutes}
        goldTimerSeconds={goldTimerSeconds}
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
