const Simulator = require('./sim');
const { randomFromArray } = require('../util');

const Multipliers = [0.1, 0.2, 0.3, 0.4, 1.2, 1.5, 1.7, 2.4];

class WheelSim extends Simulator {
    constructor(Runs, PerRun, StartingAmount) {
        super(Runs, PerRun);
        this.StartingAmount = StartingAmount;
    }

    run(initialValues, WheelStrategy) {
        if(!WheelStrategy) WheelStrategy = this.defaultStrategy;

        this.update(initialValues, (i, j, values, data) => {
            let strategyData = WheelStrategy(values.currentSim, data[i + 1]?.[j] ?? {}, j == 0);
            strategyData.betAmount = Math.floor(strategyData.betAmount);

            if(values.currentSim < strategyData.betAmount) return 'break';

            values.currentSim -= strategyData.betAmount;

            let roll = randomFromArray(Multipliers);

            let prize = Math.floor(strategyData.betAmount * roll);

            let newCurrent = values.currentSim + prize;

            let greater = newCurrent > values.currentSim ? newCurrent : values.currentSim;
            if(greater > values.record) values.record = greater;

            if(!data[i + 1]) data[i + 1] = {};

            data[i + 1][j + 1] = {
                startedWith: data[i + 1]?.[j]?.endedWith ?? values.currentSim,
                prize,
                endedWith: newCurrent,
                record: values.record,
                won: prize > strategyData.betAmount,
                betAmount: strategyData.betAmount,
                roll
            };
        });
    }

    defaultStrategy() {
        return { betAmount: 100 };
    }
}

module.exports = WheelSim;