import fs from 'fs';
import readline from 'readline';
import Papa from 'papaparse';
import _ from 'lodash';
import moment from 'moment-timezone';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.question('please enter the path to csv file ', (answer) => {
    console.log(`Thank you, processing your file: ${answer}`);
    let input_with_broken_utf = './data/sample-with-broken-utf8.csv';
    let input = './data/simple.csv';
    processCsv(input_with_broken_utf);
    rl.close();
});


function processCsv(filePath) {
    console.log(filePath);
    const input = fs.createReadStream(filePath);
    Papa.parse(input, {header: false, encoding: 'utf8', error: handleError, transform: transformInput, complete: done})
}

function handleError(error, file) {
    console.log("could not parse: "+error);
}

function transformInput(value, colNumber) {
    //console.log("value at: "+colNumber+" is:"+value);
    if(colNumber === 0){
        return dateFormatter(value);
    }

    return value;

}

function done(results, file) {
    let headingRow = _.head(results.data);

    //replace header row with transformed values
    results.data[0] = headingRow.map(val => transformHeader(val));
    console.log("Parsing complete:", results);
}

function transformHeader(value) {
    return value.toUpperCase();
}

function dateFormatter(value) {
    let formatted_date = moment.tz(value, "America/Los_Angeles");
    return formatted_date.tz("America/New_York").format();
}