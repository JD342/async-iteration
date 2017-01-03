/*

Asynchronous Iteration Utility Factory (v. 1.0.5)

Copyright (c) 2016-2017 Nicola Fiori (JD342)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

*/
const AsyncIteration = (fn) => {

    if (typeof fn !== 'function') throw TypeError('function expected');

    var done = false;
    var error, next, resolveNext;
    const values = [];

    const include = (val) => {
        if (done) throw TypeError('include function called after conclusion');
        values.push(val);
        resolveNext(true);
    };

    const iterate = () => {

        var i = 0;
        var result = undefined;
        var iteration = Promise.resolve();

        const iter = () => iteration = (async () => {
            await iteration;
            if (i >= values.length && !await next) {
                result = undefined;
                if (error) throw error;
                return false;
            }
            result = values[i++];
            return true;
        })();

        Object.defineProperty(iter, 'result', {
            enumerable: true,
            get: () => result
        });

        return iter;

    };

    const promise = async () => {
        while (await next);
        if (error) throw error;
        return values;
    };

    (async () => {
        do next = new Promise((res) => { resolveNext = res; });
        while (await next);
    })();

    (async () => {
        try { await fn(include); }
        catch (err) { error = err; }
        done = true;
        Object.freeze(values);
        resolveNext(false);
        resolveNext = null;
    })();

    return Object.freeze({ iterate, promise });

};
