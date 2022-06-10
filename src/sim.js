class Simulator {
    // amount: amount of simulations to run
    // tries: how many times a sim should run internally
    constructor(amount, tries) {
        this.amount = amount;
        this.tries = tries;
        this.data = {};
    }

    update(initialValues, callback) {
        for(let i = 0; i < this.amount; i++) {
            let values = { ...initialValues };

            for(let j = 0; j < this.tries; j++) {
                let res = callback(i, j, values, this.data);

                if(res === "break") break;
            }

            values = initialValues;
        }
    }
}

module.exports = Simulator;


// uses wheel simulator to show an example of the usage of the sim
function example() {
    let Sim = new Simulator(10, 40);

    const multipliers = [0.1, 0.2, 0.3, 0.4, 1.2, 1.5, 1.7, 2.4];
    const starting_amount = 60_000;
    const bet_amount = 30_000;

    Sim.update(
        {
            current_sim: starting_amount,
            record: starting_amount,
        },
        (i, j, values, data) => {
            if(values.current_sim <= bet_amount) return;

            values.current_sim -= bet_amount;

            let prize = bet_amount * random_from_array(multipliers);

            let new_current = values.current_sim + prize;

            if(values.current_sim > values.record) values.record = values.current_sim;

            if(!data[i + 1]) data[i + 1] = {};

            data[i + 1][j + 1] = {
                started_with: values.current_sim + bet_amount,
                prize,
                ended_with: new_current,
                record: values.record,
                won: prize > bet_amount,
            };

            values.current_sim = new_current;
        }
    )

    return data;
}