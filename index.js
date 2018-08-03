import readline from 'readline';
import {processCsv} from './utils';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const input_with_broken_utf = './data/sample-with-broken-utf8.csv';
const input1 = './data/simple.csv';
const input2 = './data/sample.csv';


rl.question('please enter the path to csv file (defaults to ./data/sample-with-broken-utf8.csv): ', (answer) => {
    console.log(`Thank you, processing your file: ${answer}`);
    if(answer) {
        processCsv(answer);
    }
    else{
        processCsv(input2);
    }

    rl.close();
});