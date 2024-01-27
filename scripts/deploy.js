const hre = require("hardhat");

async function main() {

  const Contract = await hre.ethers.getContractFactory("Fighters");
  const nft = await Contract.deploy();

  await nft.deployed();
  console.log("Contract deployed to address:", nft.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
