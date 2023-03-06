const hre = require("hardhat");

async function main() {

  const Unicorns = await hre.ethers.getContractFactory("Boss");
  const nft = await Unicorns.deploy();

  await nft.deployed();
  console.log("Contract deployed to address:", nft.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
