// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Boss is ERC721, Ownable {
    bool minted = false;
    int256 public health = 5000;
    address public caller;
    bool gameWon = false;
    event GameWon();
    constructor() ERC721("BOSS", "Boss") {}

    function setCaller(address _caller) public onlyOwner {
        caller = _caller;
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function checkWin() internal
    {
        if(health <= 0)
        {
            gameWon = true;
            emit GameWon();
        }
    }

    function decreaseHealth(int256 amount) external
    {
        require(!gameWon, "Game ended");
        //require(msg.sender == caller, "WRONG CALLER");
        health -= amount;
        checkWin();
    }

    function safeMint() public onlyOwner {
        require(!minted, "Already minted");
        minted = true;
        _safeMint(msg.sender, 0);
    }
}
