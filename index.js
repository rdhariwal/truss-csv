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

const encoding = "utf8";

const config = {header: false, encoding: encoding, error: handleError, transform: transformInput, complete: done};
let processedCsvPath = './data/';


rl.question('please enter the path to csv file ', (answer) => {
    console.log(`Thank you, processing your file: ${answer}`);
    let input_with_broken_utf = './data/sample-with-broken-utf8.csv';
    let input1 = './data/simple.csv';
    let input2 = './data/sample.csv';
    processCsv(input2);
    rl.close();
});


function processCsv(filePath) {
    const input = fs.createReadStream(filePath);
    Papa.parse(input, config);
}

function handleError(error, file) {
    console.log("could not parse: "+error);
}

function transformInput(value, colNumber) {
    //Date
    if(colNumber === 0 && value.toLowerCase()!== "timestamp"){
        return dateFormatter(value);
    }

    //zip
    if(colNumber === 2 && value.toLowerCase() !== "zip") {
        return value.padStart(5, "0");
    }

    //fullname
    if(colNumber === 3 && value.toLowerCase() !== "fullname") {
        return value.toUpperCase();
    }

    //fooduration
    if(colNumber === 4 && value.toLowerCase() !== "fooduration") {
        return moment.duration(value).asSeconds();
    }

    //barduration
    if(colNumber === 5 && value.toLowerCase() !== "barduration") {
        return moment.duration(value).asSeconds();
    }

    return value;

}

function done(results, file) {
    let headingRow = _.head(results.data);

    //replace header row with transformed values
    results.data[0] = headingRow.map(val => transformHeader(val));

    calculateDuration(results);

    console.log(Papa.unparse(results, config));

    fs.writeFile(processedCsvPath+'processed_CSV.csv', Papa.unparse(results, config), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function transformHeader(value) {
    return value.toUpperCase();
}

function dateFormatter(value) {
    let formatted_date = moment.tz(moment(value, "MM/DD/YY hh:mm:ss A"), "America/Los_Angeles");
    return formatted_date.tz("America/New_York").format();
}

function calculateDuration(results){
    results.data.forEach((el, index, arr) => {
        if(index !== 0){
            el[6] = el[5] + el[4];
        }
    });
}
