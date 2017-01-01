const { join } = require('path');
const { readFile, writeFile, mkdir } = require('mz/fs');
const { transform } = require('babel-core');
const rmfr = require('rmfr');

const {
    mainDir,
    sourceFile,
    buildDir,
    rawBuild,
    minifiedBuild,
    npmBuild,
    licenseFile
} = require('./shared/constants');

const buildUncompressed = async (code, license) => {
    await writeFile(rawBuild, `${license}\n${code}`);
};

const buildMinified = (() => {

    const options = { presets: ['babili'] };

    return async (code, license) => {
        const result = transform(code, options).code;
        await writeFile(minifiedBuild, `${license}\n${result}`);
    };

})();

const buildNpmModule = (() => {

    const header = 'require("babel-polyfill");\n';
    const footer = '\nmodule.exports = AsyncIteration;';
    const options = {
        presets: ['es2015', 'es2016', 'es2017', 'babili'],
        comments: false
    };

    return async (code, license) => {
        const result = transform(header + code + footer, options).code;
        await writeFile(npmBuild, `${license}\n${result}`);
    };

})();

(async () => {
    console.log('Building');
    process.chdir(join(__dirname, '..'));
    const codeRead = readFile(sourceFile, 'utf8');
    const licenseRead = readFile(licenseFile, 'utf8');
    await rmfr(buildDir);
    await mkdir(buildDir);
    const license = `/*\n\n${await licenseRead}\n*/`;
    const code = await codeRead;
    await Promise.all([
        buildUncompressed(code, license),
        buildMinified(code, license),
        buildNpmModule(code, license)
    ]);
    console.log('Build completed\n');
})().catch((err) => {
    console.error('\nBuild failed\n');
    console.error(err);
    console.error('');
});
