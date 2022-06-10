const Simulator = require('./sim');
const { randomUpTo, writeJSON, customDateString } = require('../util');

const Multipliers = [0, 2, 4, 10];

class BetRollSim extends Simulator {
    constructor(Runs, PerRun, StartingAmount, Strategy) {
        super(Runs, PerRun);
        this.StartingAmount = StartingAmount;

        this.Strategy = Strategy ?? defaultStrategy();
    }

    run(initialValues, BetRollStrategy) {
        if(!BetRollStrategy) BetRollStrategy = this.Strategy;

        this.update(initialValues, (i, j, values, data) => {
            let strategyData = BetRollStrategy(values.currentSim, {
                amount: data[i]?.[j]?.betAmount ?? null,
                won: data[i]?.[j]?.won ?? null
            });

            if(values.currentSim < strategyData.betAmount) return 'break';

            let prize;

            let roll = randomUpTo(100);

            if(roll > 99) {
                prize = strategyData.betAmount * Multipliers[3];
            } else if(roll > 90) {
                prize = strategyData.betAmount * Multipliers[2];
            } else if(roll > 66) {
                prize = strategyData.betAmount * Multipliers[1];
            } else {
                prize = strategyData.betAmount * Multipliers[0];
            }

            let newCurrent = values.currentSim + prize;

            let greater = newCurrent > values.currentSim ? newCurrent : values.currentSim;

            if(greater > values.record) values.record = greater;

            if(!data[i + 1]) data[i + 1] = {};

            data[i + 1][j + 1] = {
                startedWith: values.currentSim + strategyData.betAmount,
                prize,
                endedWith: newCurrent,
                record: values.record,
                won: prize > strategyData.betAmount,
                betAmount: strategyData.betAmount
            }
        });
    }
}

module.exports = BetRollSim;

function BetRollStrategy(current, lastbet) {
    let exampleBetAmount = 5_000;

    if(!lastbet.amount || lastbet.won == null) return { betAmount: exampleBetAmount };

    return {
        betAmount: lastbet.won ? exampleBetAmount : lastbet.amount * 2,
    }
}