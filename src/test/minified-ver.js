const { readFileSync } = require('fs');
const { join } = require('path');
const test = require('./shared/test');
const file = join(__dirname, '..', '..', 'build', 'async-iteration.min.js');
const js = readFileSync(file, 'utf8');

describe('[minified version]', () => {
    eval(`${js}; test(AsyncIteration);`);
});
