import readline from 'readline';
import {processCsv} from './utils';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const input_with_broken_utf = 'sample-with-broken-utf8.csv';
const input1 = 'simple.csv';
const input2 = 'sample.csv';


rl.question('please enter filename to process from "data" directory (defaults to sample-with-broken-utf8.csv): ', (answer) => {
    console.log(`Thank you, processing your file: ${answer}`);
    if(answer) {
        processCsv(answer);
    }
    else{
        processCsv(input2);
    }
    rl.close();
});