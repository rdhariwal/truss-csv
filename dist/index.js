'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _papaparse = require('papaparse');

var _papaparse2 = _interopRequireDefault(_papaparse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rl = _readline2.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.question('please enter the path to csv file ', function (answer) {
    console.log('Thank you, processing your file: ' + answer);
    var input_with_broken_utf = './data/sample-with-broken-utf8.csv';
    var input = './data/simple.csv';
    processCsv(input_with_broken_utf);
    rl.close();
});

function processCsv(filePath) {
    console.log(filePath);
    var input = _fs2.default.createReadStream(filePath);
    _papaparse2.default.parse(input, { header: false, encoding: 'utf8', error: handleError, transform: transformInput, complete: done });
}

function handleError(error, file) {
    console.log("could not parse: " + error);
}

function transformInput(value, colNumber) {
    //console.log("value at: "+colNumber+" is:"+value);
    if (colNumber === 0) {
        var formatted_date = _momentTimezone2.default.tz(value, "America/Los_Angeles");
        return formatted_date.tz("America/New_York").format();
    }

    return value;
}

function done(results, file) {
    var headingRow = _lodash2.default.head(results.data);

    //replace header row with transformed values
    results.data[0] = headingRow.map(function (val) {
        return transformHeader(val);
    });
    console.log("Parsing complete:", results);
}

function transformHeader(value) {
    return value.toUpperCase();
}