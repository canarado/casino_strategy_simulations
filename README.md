# Casino Simulations Project
This is just a small project to attempt to determine optimal strategies to win "luck" based games such as spin-the-wheel games, coinflips, and dice rolls. Specifically made to get lots of coins on the AMC discord.

## Usage
```
git clone https://github.com/canarado/casino_strategy_simulations
cd casino_strategy_simulations
cat strategy.js
```

`strategy.js`
```javascript
// This will be an example strategy for the betroll aka dice game
const BetRollSim = require('./src/betroll');

// current is the current balance of the simulation run, lastbet is the last bet object which has the bet's amount and if the bet was won or not
function strategy(current, lastbet) {
    // we will create a default bet amount for semantics sake and consistency
    let defaultBet = 2000;

    if(!lastbet.amount || lastbet.won == null) return { betAmount: defaultBet };

    // each strategy must return an object with a betAmount key, BEWARE: if you try to bet more than the current amount of currency available to you, the sim will assume you have lost and skip to the next simulation iteration
    return {
        betAmount: lastbet.won ? defaultBet : lastbet.amount * 2,
    }
}

// this is the amount of currency you will begin with
const StartingAmount = 60_000;

// first argument is the amount of simulations to run and the second is the amount of rounds per simulation
let simulator = new BetRollSim(50, 300, StartingAmount, strategy);

simulator.run({ currentSim: StartingAmount, record: StartingAmount });
```
## Explanation
Each strategy gets a few variables available to it, the current amount of coins in that round of the simulation and the last bet object, which contains an amount that was bet, and if the previous bet was a loss or a win. This strategy is ran per round of each simulation, similar to a game engines frame updating functions.

## Subject to change
The apis in this project are likely to change, and not all features are working/will work.