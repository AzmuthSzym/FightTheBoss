const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Contract Tests", function () {
  async function deployFighters() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Fighters = await ethers.getContractFactory("Fighters");
    const fighters = await Fighters.deploy();

    return { fighters, owner, otherAccount };
  }

  async function deployBoss()
  {
    const [owner, otherAccount] = await ethers.getSigners();

    const Boss = await ethers.getContractFactory("Boss");
    const boss = await Boss.deploy();

    return { boss, owner, otherAccount };    
  }

  describe("Fighters Deployment", function () {
    it("Should set the right name of the NFT", async function () {
      const { fighters } = await loadFixture(deployFighters);

      expect(await fighters.name()).to.equal("FGHT");
    });

    it("Should set the right owner", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);

      expect(await fighters.owner()).to.equal(owner.address);
    });
  });

  describe("Boss Deployment", function () {
    it("Should set the right owner", async function () {
      const { boss, owner } = await loadFixture(deployBoss);

      expect(await boss.owner()).to.equal(owner.address);
    });
  });

  describe("Fighters Mint", function () {
    it("Should mint NFT to the owner", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);

      await expect(fighters.safeMint(owner.address)).to.emit(fighters, "Mint").withArgs(owner.address);
    });

    it("Should create fighter in the 'fighters' array", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);
      
      await fighters.safeMint(owner.address);
      const mintedFighter = await fighters.fighters(0);
      expect(mintedFighter['id']).to.equal(0);
      expect(mintedFighter['power']).to.equal(100);
      expect(mintedFighter['attacksAmt']).to.equal(0);
      
    });
  });

  describe("Fighters initalization", function () {
    it("Should set the correct Boss contract address", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);
      const { boss } = await loadFixture(deployBoss);

      await fighters.setBossContractAddress(boss.address);
      const BossCA = await fighters.bossContract();
      
      expect(boss.address).to.equal(BossCA);
    });
  });

  describe("Fighter attack", function () {
    it("Should attack the Boss and increase stats", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);
      const { boss } = await loadFixture(deployBoss);

      //Minting NFT
      await fighters.safeMint(owner.address);
      
      //Initializing Boss CA
      await fighters.setBossContractAddress(boss.address);
      
      //Wait 5 seconds for the cooldown to wear off
      await time.increase(5);

      //Attacking using the NFT
      await fighters.connect(owner).attack(0);

      //Boss health should be decreased
      expect(await boss.health()).to.equal(4900);

      //Check fighter stats
      const mintedFighter = await fighters.fighters(0);
      expect(mintedFighter['power']).to.be.above(101);
      expect(mintedFighter['attacksAmt']).to.equal(1);
    });

    it("Should perform only one attack because of cooldown", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);
      const { boss } = await loadFixture(deployBoss);

      await fighters.safeMint(owner.address);
      await fighters.setBossContractAddress(boss.address);
      await time.increase(5);
      await fighters.connect(owner).attack(0);

      await expect(fighters.connect(owner).attack(0)).to.be.rejectedWith("Fighter is on cooldown");
      expect(await boss.health()).to.equal(4900);
    });

    /*it("Should perform two attacks", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);
      const { boss } = await loadFixture(deployBoss);

      await fighters.safeMint(owner.address);
      await fighters.setBossContractAddress(boss.address);
      await time.increase(5);
      await fighters.connect(owner).attack(0);
      await time.increase(5);
      await fighters.connect(owner).attack(0);

      expect(await boss.health()).to.equal(4798);

      const mintedFighter = await fighters.fighters(0);
      expect(mintedFighter['power']).to.equal(104);
      expect(mintedFighter['attacksAmt']).to.equal(2);      
    });*/ 
  });

  describe("Winning the game", function () {
    it("Should emit GameWon event", async function () {
      const { fighters, owner } = await loadFixture(deployFighters);
      const { boss } = await loadFixture(deployBoss);

      let gameWonEventEmitted = false;

      await fighters.safeMint(owner.address);
      await fighters.setBossContractAddress(boss.address);

      await time.increase(5);
      
      for(let i = 0; i < 36; i++)
      {
        //Perform the attack
        await fighters.connect(owner).attack(0);
        await time.increase(5);

        // Listen for GameWon event from boss contract
        const bossFilter = boss.filters.GameWon();
        const events = await boss.queryFilter(bossFilter);

        if (events.length > 0) {
          gameWonEventEmitted = true;
          break; // Exit the loop if the event is emitted
        }
      }
      
      //Lethal blow
      expect(gameWonEventEmitted).to.be.true;
      expect(await boss.health()).to.below(0);
    });
  });

});
