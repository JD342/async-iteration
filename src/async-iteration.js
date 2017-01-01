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
