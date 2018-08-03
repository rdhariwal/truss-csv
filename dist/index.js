'use strict';

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rl = _readline2.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var input_with_broken_utf = './data/sample-with-broken-utf8.csv';
var input1 = './data/simple.csv';
var input2 = './data/sample.csv';

rl.question('please enter the path to csv file (defaults to ./data/sample-with-broken-utf8.csv): ', function (answer) {
    console.log('Thank you, processing your file: ' + answer);
    if (answer) {
        (0, _utils.processCsv)(answer);
    } else {
        (0, _utils.processCsv)(input2);
    }

    rl.close();
});