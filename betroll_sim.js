const Simulator = require('./src/sim');
const { randomUpTo, writeJSON, customDateString } = require('./util');

const Runs = 25;
const PerRun = 300;

const Multipliers = [0, 2, 4, 10];
const StartingAmount = 100_000;
const BetAmount = 6_000;

let sim = new Simulator(Runs, PerRun);

sim.update({ currentSim: StartingAmount, record: StartingAmount }, (i, j, values, data) => {
    if(values.currentSim < BetAmount) return 'break';

    values.currentSim -= BetAmount;

    let prize;

    let roll = randomUpTo(100);

    if(roll > 99) {
        prize = BetAmount * Multipliers[3];
    } else if(roll > 90) {
        prize = BetAmount * Multipliers[2];
    } else if(roll > 66) {
        prize = BetAmount * Multipliers[1];
    } else {
        prize = BetAmount * Multipliers[0];
    }

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
    }

    values.currentSim = newCurrent;
});

writeJSON(`./betroll_runs/betroll_sim_${customDateString()}.json`, sim.data);