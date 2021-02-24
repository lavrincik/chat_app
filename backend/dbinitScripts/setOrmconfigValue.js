'use strict';
const fs = require('fs');
const path = require('path');

const myArgs = process.argv.slice(2);

const usage = `Usage:
node setOrmconfigValue --username string |
node setOrmconfigValue -u string |
node setOrmconfigValue --password string |
node setOrmconfigValue -p string |
node setOrmconfigValue --database string |
node setOrmconfigValue -d string |
node setOrmconfigValue --host string |
node setOrmconfigValue -h string`;

if (myArgs.length === (0 || 1)) {
    console.error(
        `No json attribute / value pair for ormconfig provided.

${usage}`
    );
    return 0;
}

if (myArgs.length > 2) {
    console.error(
        `Only one json attribute at a time

${usage}`
    );
    return 0;
}

let attribute;
let value;

let argv_length = 0;
while (argv_length !== myArgs.length) {
    switch (myArgs[argv_length]) {
        case '--username':
        case '-u':
            attribute = 'username';
            argv_length++;
            value = myArgs[argv_length];
            break;
        case '--password':
        case '-p':
            attribute = 'password';
            argv_length++;
            value = myArgs[argv_length];
            break;
        case '--database':
        case '-d':
            attribute = 'database';
            argv_length++;
            value = myArgs[argv_length];
            break;
        case '--host':
        case '-h':
            attribute = 'host';
            argv_length++;
            value = myArgs[argv_length];
            break;
        default:
            console.error(usage);
            return 1;
    }

    ++argv_length;
}

const ormconfigPath = path.join(__dirname, '../ormconfig.json');
const config = fs.readFileSync(ormconfigPath, { encoding: 'utf-8' });

const json = JSON.parse(config);
json[attribute] = value;
const newConfig = JSON.stringify(json, null, 2);

fs.writeFileSync(ormconfigPath, newConfig, { encoding: 'utf-8' });
