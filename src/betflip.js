const Simulator = require('./sim');

class BetFlipSimulator extends Simulator {
    constructor(Runs, PerRun, StartingAmount) {
        super(Runs, PerRun);
        this.StartingAmount = StartingAmount;
    }

    run(initialValues, strategy) {
        if(!strategy) strategy = this.defaultStrategy;

        this.update(initialValues, (i, j, values, data) => {
            let strategyData = strategy(values.currentSim, data[i + 1]?.[j] ?? {}, j == 0);
            strategyData.betAmount = Math.floor(strategyData.betAmount);

            if(values.currentSim < strategyData.betAmount) return 'break';

            values.currentSim -= strategyData.betAmount;

            let flip = Math.random() > 0.5 ? 'heads' : 'tails';

            let prize = strategyData.coin == flip ? Math.floor(strategyData.betAmount * 1.9) : 0;

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
                flip
            }
        })
    }

    defaultStrategy() {
        return { betAmount: 100 };
    }
}

module.exports = BetFlipSimulator;