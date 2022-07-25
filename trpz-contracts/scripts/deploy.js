const hre = require("hardhat");

async function main() {
  const LootBoxes = await hre.ethers.getContractFactory("lootBoxes");
  const lootBoxes = await LootBoxes.deploy(
    "Silver Loot",
    "SILVERTRPZ",
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
