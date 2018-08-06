import fs from 'fs';
import Papa from "papaparse";
import moment from "moment-timezone";
import _ from "lodash";

const processedCsvPath = './data/';
const encoding = "utf8";
const config = {header: false, encoding: encoding, error: handleError, transform: transformInput, complete: done};


function processCsv(filePath) {
    const input = fs.createReadStream(processedCsvPath+filePath);
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

    //calculate and set total duration
    calculateDuration(results);

    //print output to console
    console.log(Papa.unparse(results, config));

    // save the output to a file
    fs.writeFile(processedCsvPath+'processed_CSV.csv', Papa.unparse(results, config), (err) => {
        if (err) throw err;
        console.log('The file has been saved!'+processedCsvPath+'processed_CSV.csv');
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

export {processCsv};