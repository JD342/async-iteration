const Jasmine = require('jasmine');
const { relative } = require('path');
const { testDir } = require('./shared/constants');
const { version } = process;

const options = { spec_dir: relative(process.cwd(), testDir) };

if (/^v[0-9]+/.test(version) && version.match(/^v([0-9]+)/)[1] >= 7) {
    // Test NPM, compressed and uncompressed version if on node v7+
    options.spec_files = ['*.js'];
}
else {
    // Test NPM version only, compressed and uncompressed versions are not
    // transpiled to support ES5 environments
    options.spec_files = ['npm-ver.js'];
}

(async () => {
    console.log('Testing\n');
    const jasmine = new Jasmine();
    jasmine.loadConfig(options);
    jasmine.execute();
    const passed = await new Promise((res) => { jasmine.onComplete(res); });
    console.log('\nTest completed\n');
    if (!passed) process.exit(-1);
})().catch((err) => {
    console.error('\nTest failed\n');
    console.error(err);
    process.exit(-1);
});
