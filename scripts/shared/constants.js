const { resolve } = require('path');

exports.mainDir =       resolve(__dirname, '..', '..');
exports.buildDir =      resolve(exports.mainDir, 'build');
exports.sourceDir =     resolve(exports.mainDir, 'src');
exports.rawBuild =      resolve(exports.buildDir, 'async-iteration.js');
exports.minifiedBuild = resolve(exports.buildDir, 'async-iteration.min.js');
exports.npmBuild =      resolve(exports.buildDir, 'async-iteration.npm.js');
exports.sourceFile =    resolve(exports.sourceDir, 'async-iteration.js');
exports.testDir =       resolve(exports.sourceDir, 'test');
exports.licenseFile =   resolve(exports.mainDir, 'LICENSE');
exports.packageFile =   resolve(exports.mainDir, 'package.json');
