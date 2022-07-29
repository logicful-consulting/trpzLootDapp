const hre = require("hardhat");

async function main() {
  console.log("Running deploy script...");
  // const TestToken = await hre.ethers.getContractFactory("testToken");
  // const testToken = await TestToken.deploy(10000, "0xC59b3779A592B620028c77Ab1742c9960e038e4C");
  // await testToken.deployed();
  // console.log("Deployed testToken contract to", testToken.address);

  const LootBoxes = await hre.ethers.getContractFactory("lootBoxes");
  const lootBoxes = await LootBoxes.deploy(
    "BRONZE Loot",
    "BRONZETRPZ",
    "0xa0a4f43b83971Afb63bEd3F619203AE0fb164AC7"
  );
  await lootBoxes.deployed();
  console.log("lootBoxes deployed to:", lootBoxes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
