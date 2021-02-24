'use strict';
const fs = require('fs');
const path = require('path');

const myArgs = process.argv.slice(2);

if (myArgs.length === 0) {
    console.error(
        `No json attribute for ormconfig provided.
    
Usage: 
node getOrmconfigValue.js attribute`
    );
    return 0;
}

if (myArgs.length > 1) {
    console.error(
        `Only one json attribute at a time.
    
Usage: 
node getOrmconfigValue.js attribute`
    );
    return 0;
}


const attribute = myArgs[0];

const ormconfigPath = path.join(__dirname, '../ormconfig.json');
const config = fs.readFileSync(ormconfigPath, { encoding: 'utf-8' });

const json = JSON.parse(config);
console.log(json[attribute]);
