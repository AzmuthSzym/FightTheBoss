// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BossInterface {
    function decreaseHealth(int256 amount) external {}
}
contract Fighters is ERC721, ERC721Burnable, Ownable {
    event Attack(uint8 tokenId);
    BossInterface bossContract;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint8 maxSupply = 255;

    struct Fighter{
        uint8 id;
        int8 power;
        int16 attacksAmt;
        uint timestamp;
    }
    Fighter[] public fighters;

    constructor() ERC721("TEST", "TEST") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmU6SBB9rSGfKhz5HoftRkRz5J28QmNQJJvcguwD7DHq6E";
    }

    function tokenURI(uint256 tokenId) public pure override returns (string memory) {
        return _baseURI();
    }

    function setBossContractAddress(address _address) external onlyOwner {
        bossContract = BossInterface(_address);
    }

    function safeMint(address to) public {
        require(_tokenIdCounter.current() <= maxSupply, "Max supply reached");
        uint8 tokenId = uint8(_tokenIdCounter.current());
        fighters.push(Fighter(tokenId, 100, 0, 0));
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function attack(uint8 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "ERROR");
        require(fighters[tokenId].timestamp + 5 minutes < block.timestamp,"Fighter is on cooldown");
        // Attack is increased by two, this will be changed after random value is added
        fighters[tokenId].power += 2;
        fighters[tokenId].attacksAmt += 1;
        fighters[tokenId].timestamp = block.timestamp;
        bossContract.decreaseHealth(fighters[tokenId].power);
        emit Attack(tokenId);
    }
}
