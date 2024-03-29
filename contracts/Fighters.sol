// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BossInterface {
    function decreaseHealth(uint256 amount) external {}
}
contract Fighters is ERC721, ERC721Burnable, Ownable {
    event Attack(uint8 tokenId);
    event Mint(address owner);

    BossInterface public bossContract;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint8 maxSupply = 255;
    uint256 private nonce;

    //TODO: CHANGE THE OWNER WHILE TOKEN IS TRANSFERRED
    mapping(address => uint256[]) private ownedTokens;

    struct Fighter{
        uint8 id;
        uint16 power;
        int8 attacksAmt;
        uint lastAttack;
    }
    Fighter[] public fighters;

    constructor() ERC721("FGHT", "Fighters") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmU6SBB9rSGfKhz5HoftRkRz5J28QmNQJJvcguwD7DHq6E";
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return _baseURI();
    }

    function setBossContractAddress(BossInterface _address) external onlyOwner {
        bossContract = BossInterface(_address);
    }

    function safeMint(address to) public {
        require(_tokenIdCounter.current() <= maxSupply, "Max supply reached");
        uint8 tokenId = uint8(_tokenIdCounter.current());
        ownedTokens[to].push(tokenId);
        fighters.push(Fighter(tokenId, 100, 0, block.timestamp));
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        emit Mint(to);
    }

    function generateRandomNumber() internal returns (uint256) {
        nonce++;
        return uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, nonce))));
    }

    function attack(uint8 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can initiate the attack");
        require(fighters[tokenId].lastAttack + 5 seconds < block.timestamp,"Fighter is on cooldown");
        // Attack is increased by two, this will be changed after random value is added
        uint256 randomNumber = generateRandomNumber();
        bossContract.decreaseHealth(fighters[tokenId].power);
        fighters[tokenId].power = uint16(fighters[tokenId].power + (randomNumber % 10) + 1);
        fighters[tokenId].attacksAmt += 1;
        fighters[tokenId].lastAttack = block.timestamp;
        emit Attack(tokenId);
    }

    function getOwnedTokens(address tokenOwner) external view returns (uint256[] memory) {
        return ownedTokens[tokenOwner];
    }
}
