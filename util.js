const fs = require('fs');

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function writeJSON(filepath, json) {
    fs.writeFileSync(filepath, JSON.stringify(json, null, 2));
}

function customDateString() {
    let date = new Date();

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

function randomUpTo(num) {
    return Math.floor(Math.random() * (num + 1));
}

module.exports = {
    randomFromArray,
    writeJSON,
    customDateString,
    randomUpTo,
}