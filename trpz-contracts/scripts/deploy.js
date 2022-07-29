const hre = require("hardhat");

async function main() {
  console.log("Running deploy script...");
  const LootBoxes = await hre.ethers.getContractFactory("lootBoxes");
  console.log("Got LootBoxes contract factory...");
  const lootBoxes = await LootBoxes.deploy(
    "BRONZE Loot",
    "BRONZETRPZ",
    "0xa0a4f43b83971Afb63bEd3F619203AE0fb164AC7"
  );
  console.log("Deploying....")
  await lootBoxes.deployed();
  console.log("lootBoxes deployed to:", lootBoxes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
