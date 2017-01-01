const Jasmine = require('jasmine');
const { relative } = require('path');
const { testDir } = require('./shared/constants');

const options = {
    spec_dir: relative(process.cwd(), testDir),
    spec_files: ['*.js']
};

(async () => {
    console.log('Testing\n');
    const jasmine = new Jasmine();
    jasmine.loadConfig(options);
    jasmine.execute();
    await new Promise((res) => { jasmine.onComplete(res); });
    console.log('\nTest completed\n');
})().catch((err) => {
    console.error('\nTest failed\n');
    console.error(err);
});
