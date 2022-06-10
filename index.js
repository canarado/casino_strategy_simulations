const multipliers = [0.1, 0.2, 0.3, 0.4, 1.2, 1.5, 1.7, 2.4];
const starting_amount = 60_000;
const bet_amount = 4_000;
const sims = 500;
const tries_per_sim = 750;

let data = {};

for(let i = 0; i < sims; i++) {

    let current_sim = starting_amount;
    let record = starting_amount;

    for(let j = 0; j < tries_per_sim; j++) {
        if(current_sim <= bet_amount) break;

        current_sim -= bet_amount;

        let prize = bet_amount * random_from_array(multipliers);

        let new_current = current_sim + prize;

        if(current_sim > record) record = current_sim;

        // data[i + 1] = {
        //     [j + 1]: {
        //         started_with: current_sim,
        //         prize: prize,
        //         ended_with: new_current,
        //         record: record,
        //     }
        // }

        if(!data[i + 1]) data[i + 1] = {};

        data[i + 1][j + 1] = {
            started_with: current_sim + bet_amount,
            prize,
            ended_with: new_current,
            record,
            won: prize > bet_amount,
        };

        current_sim = new_current;
    }
}


function random_from_array(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const fs = require('fs');

fs.writeFileSync('./test.json', JSON.stringify(data, null, 2));