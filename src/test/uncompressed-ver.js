const { readFileSync } = require('fs');
const { join } = require('path');
const test = require('./shared/test');
const file = join(__dirname, '..', '..', 'build', 'async-iteration.js');
const js = readFileSync(file, 'utf8');

describe('[uncompressed version]', () => {
    eval(`${js}; test(AsyncIteration);`);
});
