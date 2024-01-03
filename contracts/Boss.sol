// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Boss is Ownable {
    event GameWon();

    int256 public health = 5000;
    bool public gameWon = false;

    constructor() {}

    function checkWin() internal
    {
        if(health <= 0)
        {
            gameWon = true;
            emit GameWon();
        }
    }

    function decreaseHealth(uint256 amount) external
    {
        require(!gameWon, "Game ended");
        health -= int256(amount);
        checkWin();
    }
}
