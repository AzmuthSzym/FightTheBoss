# Fight The Boss

## This is a project of my very simple on-chain game with NFTs.

The idea is that there are fighter and a boss, that fighters want to beat to win the prize. 
Fighters can be minted by users and used to attack the boss (there is a cooldown between attacks).
The amount of attacks that every fighter performed is counted.
Whoever attacks the last wins the main prize, but there will be smaller prizes for the fighters with most attacks performed.

## Testing 
To test the contracts you need to use the command:
```
npx hardhat test --network hardhat
```

## TODO:
1. Add tests to contracts
2. Increase power of the fighter after attack
3. Add luck factor to attack to randomize it