const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Fighters Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFighters() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Fighters = await ethers.getContractFactory("Fighters");
    const fighters = await Fighters.deploy();

    return { fighters, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right name of the NFT", async function () {
      const { fighters } = await loadFixture(deployFighters);

      expect(await fighters.name()).to.equal("TEST");
    });

    it("Should set the right owner", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);

      expect(await fighters.owner()).to.equal(owner.address);
    });
  });
});
