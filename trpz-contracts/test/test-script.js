const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy Contract", function () {
  it("Should return the name and symbol of NFT", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners(); 
    const LootBox = await ethers.getContractFactory("lootBoxes");
    const lootBox = await LootBox.deploy(
      "Gold Loot",
      "GOLDTRPZ",
      "0x80Ff3a8dcA6223fbAdaDd62D76Bfa56c3B0Df0ba"
    );
    await lootBox.deployed();

    expect(await lootBox.name()).to.equal("Gold Loot");
    expect(await lootBox.symbol()).to.equal("GOLDTRPZ");
  });
  it("Should return the name and symbol of coin", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners(); 
    const TestToken = await ethers.getContractFactory("testToken");
    const testToken = await TestToken.deploy(1000000, owner.address);
    await testToken.deployed();

    expect(await testToken.name()).to.equal("Test Token");
    expect(await testToken.symbol()).to.equal("TEST");
  });
});

describe("Test admin setup function", function () {
  before(async function () {
    LootBox = await ethers.getContractFactory("lootBoxes");
    lootBox = await LootBox.deploy(
      "Gold Loot",
      "GOLDTRPZ",
      "0x80Ff3a8dcA6223fbAdaDd62D76Bfa56c3B0Df0ba"
    );
    await lootBox.deployed();
  });
  it("Should return the name and symbol", async function () {
    expect(await lootBox.name()).to.equal("Gold Loot");
    expect(await lootBox.symbol()).to.equal("GOLDTRPZ");
  });
  it("Should change max mints", async function () {
    await lootBox.changeMax(10);
    expect(await lootBox.maxClaims()).to.equal(10);
  });
  it("Should change boxes available", async function () {
    await lootBox.launchBox(25);
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    expect(await lootBox.boxesAvailable()).to.equal(25);
    expect(await lootBox.launchTime()).to.equal(timestampBefore);
  });
  it("Should pause contract", async function () {
    expect(await lootBox.paused()).to.equal(false);
    await lootBox.pauseContract();
    expect(await lootBox.paused()).to.equal(true);
  });
  xit("Should withdraw TRPZ", async function () {
  });
});

describe("Test minting functions", function () {
  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners(); 

    TestToken = await ethers.getContractFactory("testToken");
    testToken = await TestToken.deploy(100, owner.address);
    await testToken.deployed();
    await testToken.transfer(addr1.address, 80);

    LootBox = await ethers.getContractFactory("lootBoxes");
    lootBox = await LootBox.deploy(
      "Gold Loot",
      "GOLDTRPZ",
      testToken.address
    );
    await lootBox.deployed();
  });
  it("Should revert on mint", async function () {
    await expect(lootBox.mintBox()).to.be.reverted;
  });
  it("Should change max mints to 1", async function () {
    await lootBox.changeMax(2);
    expect(await lootBox.maxClaims()).to.equal(2);
  });
  it("Should change box cost to 10", async function () {
    await lootBox.changeBoxCost(10);
    expect(await lootBox.boxCost()).to.equal(10);
  });
  it("Should change cooldown to 30 mins", async function () {
    await lootBox.changeCooldown(1800);
    expect(await lootBox.cooldownTime()).to.equal(1800);
  });
  it("Should change boxes available to 2", async function () {
    await lootBox.launchBox(4);
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    expect(await lootBox.boxesAvailable()).to.equal(4);
    expect(await lootBox.launchTime()).to.equal(timestampBefore);
  });
  it("Should approve 100 allowance", async function () {
    await testToken.approve(lootBox.address, 100);
    expect(await testToken.allowance(owner.address, lootBox.address)).to.equal(100);
  });
  it("Should mint a box for owner", async function () {
    expect(await testToken.balanceOf(lootBox.address)).to.equal(0);
    expect(await lootBox.boxCount()).to.equal(0);
    await lootBox.mintBox();
    expect(await lootBox.boxCount()).to.equal(1);
    expect(await lootBox.boxesAvailable()).to.equal(3);
    expect(await lootBox.balanceOf(owner.address)).to.equal(1);
    expect(await testToken.balanceOf(lootBox.address)).to.equal(10);
  });
  it("Should revert because of cooldown", async function () {
    await expect(lootBox.mintBox()).to.be.revertedWith("COOLDOWN_ACTIVE")
  });
  it("Should revert because lack of funds", async function () {
    await expect(lootBox.connect(addr2).mintBox()).to.be.reverted
  });
  it("Should approve 20 allowance", async function () {
    await testToken.connect(addr1).approve(lootBox.address, 20);
    expect(await testToken.allowance(addr1.address, lootBox.address)).to.equal(20);
  });
  it("Should mint a box for addr1", async function () {
    expect(await lootBox.boxCount()).to.equal(1);
    await lootBox.connect(addr1).mintBox();
    expect(await lootBox.boxCount()).to.equal(2);
    expect(await lootBox.boxesAvailable()).to.equal(2);
    expect(await lootBox.balanceOf(addr1.address)).to.equal(1);
  });
  it("Should increase time by >30 minutes", async function () {
    await network.provider.send("evm_increaseTime", [1900]);
    await network.provider.send("evm_mine");
  });
  it("Should mint second box for owner", async function () {
    /// Mint box and leaves one box available
    await lootBox.mintBox();
    expect(await lootBox.boxCount()).to.equal(3);
    expect(await lootBox.boxesAvailable()).to.equal(1);
    expect(await lootBox.balanceOf(owner.address)).to.equal(2);
  });
  it("Should increase time by >30 minutes", async function () {
    await network.provider.send("evm_increaseTime", [1900]);
    await network.provider.send("evm_mine");
  });
  it("Should revert because of max mint", async function () {
    await expect(lootBox.mintBox()).to.be.revertedWith("MAX_CLAIMS_REACHED");
  });
  it("Should mint second box for addr1", async function () {
    await lootBox.connect(addr1).mintBox();
    expect(await lootBox.boxCount()).to.equal(4);
    expect(await lootBox.boxesAvailable()).to.equal(0);
    expect(await lootBox.balanceOf(owner.address)).to.equal(2);
  });
  it("Should revert because of availability", async function () {
    await expect(lootBox.connect(addr2).mintBox()).to.be.revertedWith("NO_MORE BOXES")
  });
  it("Should withdraw token", async function () {
    expect(await testToken.balanceOf(lootBox.address)).to.equal(40);
    await lootBox.withdrawTRPZ();
    expect(await testToken.balanceOf(lootBox.address)).to.equal(0);
    expect(await testToken.balanceOf(owner.address)).to.equal(40);
  });
  it("Should burn box", async function () {
    expect(await lootBox.boxCount()).to.equal(4);
    await lootBox.burnBox(1);
    expect(await lootBox.balanceOf(owner.address)).to.equal(1);
  });
});
