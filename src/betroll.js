const Simulator = require('./sim');
const { randomUpTo, writeJSON, customDateString } = require('../util');

const Multipliers = [0, 2, 4, 10];

// BetRollSim inherits from Simulator so that simulator can handle the frame logic
class BetRollSim extends Simulator {
    constructor(Runs, PerRun, StartingAmount, Strategy) {
        super(Runs, PerRun);
        this.StartingAmount = StartingAmount;

        this.Strategy = Strategy ?? this.defaultStrategy();
    }

    run(initialValues, BetRollStrategy) {
        // if a strategy is not provided in the function, use the class strategy
        if(!BetRollStrategy) BetRollStrategy = this.Strategy;

        // per round, do x
        this.update(initialValues, (i, j, values, data) => {
            // provide current current supply, data of the last bet, and if this is first round
            // the strategy should return an object with a betAmount key determined by the aforemention values
            let strategyData = BetRollStrategy(values.currentSim, data[i + 1]?.[j] ?? {}, j == 0);
            strategyData.betAmount = Math.floor(strategyData.betAmount);

            // if the current supply of currency is less than the bet, end the round
            if(values.currentSim < strategyData.betAmount) return 'break';

            values.currentSim -= strategyData.betAmount;

            // instantiate prize
            let prize;

            // assign a number from 0-100 as our roll to emulate the dice game
            let roll = randomUpTo(100);

            // this is p obvious
            if(roll > 99) {
                prize = strategyData.betAmount * Multipliers[3];
            } else if(roll > 90) {
                prize = strategyData.betAmount * Multipliers[2];
            } else if(roll > 66) {
                prize = strategyData.betAmount * Multipliers[1];
            } else {
                prize = strategyData.betAmount * Multipliers[0];
            }

            // set the new amount of currency available based on the bet's result
            let newCurrent = values.currentSim + prize;

            // decide if the current supply is greater than the last round's record
            let greater = newCurrent > values.currentSim ? newCurrent : values.currentSim;
            if(greater > values.record) values.record = greater;

            // create data[i + 1] aka the current sim iteration's data if it does not yet exist
            if(!data[i + 1]) data[i + 1] = {};

            // assign values to data[i + 1][j + 1] aka the current round of the current sim
            data[i + 1][j + 1] = {
                startedWith: values.currentSim + strategyData.betAmount,
                prize,
                endedWith: newCurrent,
                record: values.record,
                won: prize > strategyData.betAmount,
                betAmount: strategyData.betAmount,
                roll
            }
        });
    }

    defaultStrategy() {
        return { betAmount: 100 };
    }
}

module.exports = BetRollSim;