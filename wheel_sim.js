const simulator = require('./src/sim');
const { randomFromArray, writeJSON, customDateString } = require('./util');

const Runs = 25;
const PerRun = 300;

const Multipliers = [0.1, 0.2, 0.3, 0.4, 1.2, 1.5, 1.7, 2.4];
const StartingAmount = 100_000;
const BetAmount = 6_000;

let sim = new simulator(Runs, PerRun);

sim.update({ currentSim: StartingAmount, record: StartingAmount }, (i, j, values, data) => {
    if(values.currentSim < BetAmount) return 'break';

    values.currentSim -= BetAmount;

    let prize = BetAmount * randomFromArray(Multipliers);

    let newCurrent = values.currentSim + prize;

    let greater = newCurrent > values.currentSim ? newCurrent : values.currentSim;

    if(greater > values.record) values.record = greater;

    if(!data[i + 1]) data[i + 1] = {};

    data[i + 1][j + 1] = {
        startedWith: values.currentSim + BetAmount,
        prize,
        endedWith: newCurrent,
        record: values.record,
        won: prize > BetAmount,
    };

    values.currentSim = newCurrent;
});

writeJSON(`./wheel_runs/wheel_sim_${customDateString()}.json`, sim.data);