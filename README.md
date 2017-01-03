# async-iteration

[![License][license-image]][license-url]
[![Build status][travis-image]][travis-url]

  Enables asynchronous iteration on sets of deferred data.

## Table of Contents

  * [Installation](#installation)
  * [Examples](#examples)
    * [Basic](#basic-example)
    * [Advanced](#advanced-example-reading-files-using-mz-)
  * [API](#api)
  * [License](#license)


## Installation

##### As a node package

```
npm install async-iteration
```

##### As a standalone source

  Download [uncompressed] or [minified] source.

  This NPM package is transpiled using [Babel] to support ES5 environments, but
  the linked standalone sources aren't. You'll need to transpile them yourself
  in your project if support of older environments is needed.

## Examples

#### Basic example

##### With es8 async functions

```js
const AsyncIteration = require('async-iteration');

const iteration = AsyncIteration(async (include) => {
    include(3);
    await new Promise((res) => { setTimeout(res, 1000); }); // Wait for 1 second
    include(4);
    include(2);
    // Population finishes when this async function resolves
    // (subsequent calls to `include` will throw a TypeError)
});

// Iterate asynchronously
(async () => {
    for (const iter = iteration.iterate(); await iter();) {
        console.log(iter.result);
    }
})();

// Wait for completion
(async () => {
    const values = await iteration.promise();
    console.log('completed!');
    console.log(values);
})();
```

Outputs:

```
3
4
2
completed!
[3, 4, 2]
```

##### With es6 promises only

```js
var AsyncIteration = require('async-iteration');

var iteration = AsyncIteration(function (include) {
    // Population finishes when the returned promise resolves
    // (subsequent calls to `include` will throw a TypeError)
    return new Promise(function (resolve, reject) {
        include(3);
        setTimeout(resolve, 1000); // wait for 1 second
    }).then(function () {
        include(4);
        include(2);
    });
});

// Iterate asynchronously
var iter = iteration.iterate();
iter().then(function iterate(more) {
    if (!more) return;
    console.log(iter.result);
    iter().then(iterate);
});

// Wait for completion
iteration.promise().then(function (values) {
    console.log('completed!');
    console.log(values);
});

```

Outputs:

```
3
4
2
completed!
[3, 4, 2]
```

#### Advanced example: reading files using [mz]

##### With es8 async functions

```js
const { readFile } = require('mz/fs');
const AsyncIteration = require('async-iteration');

const files = ['path/to/file1', 'path/to/file2', 'path/to/file3'];

const results = AsyncIteration(async (include) => {
    // Read all files, order will depend on read speed,
    // the first files to be read are the first to be included
    await Promise.all(files.map((file) => (async () => {
        const content = await readFile(file, 'utf8');
        include({ file, content });
    })()));
});

(async () => {
    // Iterate asynchronously through results
    for (const iter = results.iterate(); await iter();) {
        const { file, content } = iter.result;
        console.log(file);
        console.log(content);
    }
    // Note: It is possible to handle eventual errors, `iter` doesn't silence
    // errors, it will throw if readFile throws.
})();
```

Possible output:

```
path/to/file2
... (content of file2)
path/to/file1
... (content of file1)
path/to/file3
... (content of file3)
```

##### With es6 promises only

```js
var readFile = require('mz/fs').readFile;
var AsyncIteration = require('async-iteration');

var files = ['path/to/file1', 'path/to/file2', 'path/to/file3'];

var results = AsyncIteration(function (include) {
    // Read all files, order will depend on read speed,
    // the first files to be read are the first to be included
    var promises = [];
    files.forEach(function (file) {
        var promise = readFile(file, 'utf8').then(function (content) {
            include({
                file: file,
                content: content
            });
        });
        promises.push(promise);
    });
    return Promise.all(promises);
});

// Iterate asynchronously through results
var iter = results.iterate();
iter().then(function iterate(more) {
    if (!more) return;
    var file = iter.result.file;
    var content = iter.result.content;
    console.log(file);
    console.log(content);
    iter().then(iterate);
});
// Note: It is possible to handle eventual errors with Promise.prototype.catch,
// `iter` doesn't silence errors, it will reject if readFile rejects.

```

Possible output:

```
path/to/file2
... (content of file2)
path/to/file1
... (content of file1)
path/to/file3
... (content of file3)
```

## API

* __`AsyncIteration` factory__

  <code>var <b>iteration</b> = <u>AsyncIteration</u>(<b>asyncFn</b>);</code>

  Factory function that creates and returns a plain object used for asynchronous
  iteration.

  * __`asyncFn`__

    <code>async (<b>include</b>) => { ... }</code>

    [ES8 async function][async-funcs] or function that returns an
    [ES6 promise][promises]. It will be invoked
    immediately with an __`include`__ parameter.

    * __`include`__

      <code><u>include</u>(val);</code>

      Function passed as parameter to __`asyncFn`__. It accepts one argument.
      It can be invoked before __`asyncFn`__ resolves to resolve the next
      deferred value. It will throw an error if it is invoked after
      __`asyncFn`__ resolves.

  * __`iteration`__

    <code>var <b>iter</b> = <u>iteration</u>.iterate();</code><br>
    <code>var <b>promise</b> = <u>iteration</u>.promise();</code>

    Plain object used for iterating asynchronously through the values resolved
    by __`asyncFn`__.

    * __`iter`__

      <code>for (const <u>iter</u> = iteration.iterate(); await <u>iter</u>();)
      { const { result } = <u>iter</u>; ... }</code>

      Function that on its N<sup>th</sup> invocation will promise the
      N<sup>th</sup> value inclusion by __`asyncFn`__. It always returns a
      promise that always resolves a boolean telling if the iteration has
      concluded or not. It has a `result` property that will contain the
      N<sup>th</sup> included value on resultion of its N<sup>th</sup> returned
      promise.

    * __`promise`__

      <code>const values = await <u>promise</u>;</code>

      Promise that resolves an array of all included values after
      __`asyncFn`__ resolves.

## License

  MIT

[Babel]:         https://babeljs.io/
[uncompressed]:  build/async-iteration.js
[minified]:      build/async-iteration.min.js
[mz]:            https://github.com/normalize/mz#mz---modernize-nodejs
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]:   LICENSE
[travis-image]:  https://travis-ci.org/JD342/async-iteration.svg?branch=master
[travis-url]:    https://travis-ci.org/JD342/async-iteration
[async-funcs]:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[promises]:      https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
