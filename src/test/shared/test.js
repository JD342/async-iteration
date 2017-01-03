const test = (AsyncIteration) => {

    describe('factory', () => {

        it('should be a function', () => {
            expect(typeof AsyncIteration).toBe('function');
        });

        it('should expect a function', () => {
            const wrong = [
                () => { AsyncIteration(); },
                () => { AsyncIteration({}); },
                () => { AsyncIteration('hello'); },
                () => { AsyncIteration(123); },
                () => { AsyncIteration(Symbol('hello')); },
                () => { AsyncIteration(null); },
                () => { AsyncIteration(undefined); }
            ];
            const right = [
                () => { AsyncIteration(() => {}); },
                () => { AsyncIteration(async () => {}); },
                () => { AsyncIteration(function () {}); },
                () => { AsyncIteration(function* () {}); },
                () => { AsyncIteration(async function () {}); },
                () => { AsyncIteration(function example() {}); },
                () => { AsyncIteration(function* example() {}); },
                () => { AsyncIteration(async function example() {}); },
            ];
            for (const fn of wrong) {
                expect(fn).toThrowError(TypeError, 'function expected');
            }
            for (const fn of right) {
                expect(fn).not.toThrow();
            }
        });

    });

    describe('instance', () => {

        const obj = AsyncIteration(() => {});

        it('should be an object', () => {
            expect(typeof obj).toBe('object');
        });

        it('should be frozen', () => {
            expect(Object.isFrozen(obj)).toBe(true);
        });

        it('should have two properties', () => {
            expect(Object.getOwnPropertyNames(obj).length).toBe(2);
        });

        describe('iterate method', () => {

            it('should exist', () => {
                expect('iterate' in obj).toBe(true);
            });

            it('should return a function', () => {
                const fn = obj.iterate();
                expect(typeof fn).toBe('function');
            });

        });

        describe('promise method', () => {

            it('should exist', () => {
                expect(typeof obj.promise).toBe('function');
            });

            it('should return a promise', () => {
                const promise = obj.promise();
                expect(promise instanceof Promise).toBe(true);
            });

        });

    });

    describe('conclusion promise', () => {

        it('is resolved when the passed function resolves', (done) => {
            var resolved = false;
            var checked = false;
            const iteration = AsyncIteration(async () => {
                // wait for next tick
                await new Promise(setTimeout);
                // resolve
                resolved = true;
                // check if resolution was checked
                setTimeout(() => {
                    expect(checked).toBe(true);
                    done();
                });
            });
            iteration.promise().then(() => {
                expect(resolved).toBe(true);
                checked = true;
            });
        }, 100);

        it('rejects if the passed function rejects', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include();
                await new Promise(setTimeout);
                include();
                await new Promise(setTimeout);
                throw Error('hai');
            });
            iteration.promise().then(() => {
                fail('promise should not have resolved');
            }).catch((err) => {
                expect(err instanceof Error).toBe(true);
                if (err) expect(err.message).toBe('hai');
                done();
            });
        }, 100);

        it('resolves a frozen array', (done) => {
            AsyncIteration(() => {}).promise().then((result) => {
                expect(result instanceof Array).toBe(true);
                expect(Object.isFrozen(result)).toBe(true);
                done();
            });
        }, 100);

    });

    describe('include param', () => {

        it('should be a function', () => {

            AsyncIteration((include) => {
                expect(typeof include).toBe('function');
            });

        });

        it('can be called only before the passed function resolves', (done) => {

            var i = 0;

            AsyncIteration(async (include) => {
                expect(include).not.toThrow();
                await new Promise((res) => { setTimeout(res); });
                expect(include).not.toThrow();
                setTimeout(() => {
                    expect(include).toThrowError(
                        Error,
                        'include function called after conclusion'
                    );
                    if (++i === 3) done();
                });
                expect(include).not.toThrow();
            });

            AsyncIteration((include) => {
                expect(include).not.toThrow();
                expect(include).not.toThrow();
                return new Promise((resolve) => {
                    expect(include).not.toThrow();
                    expect(include).not.toThrow();
                    setTimeout(() => {

                        expect(include).not.toThrow();

                        resolve();

                        // Promises are not resolved immediately.
                        // Promises/A+ point 2.2.4 states:
                        //    onFulfilled or onRejected must not be called until
                        //    the execution context stack contains only platform
                        //    code.
                        // (https://promisesaplus.com/#point-34)
                        expect(include).not.toThrow();

                        setTimeout(() => {
                            expect(include).toThrowError(
                                Error,
                                'include function called after conclusion'
                            );
                            if (++i === 3) done();
                        });

                    });
                });
            });

            AsyncIteration((include) => {
                expect(include).not.toThrow();
                expect(include).not.toThrow();
                setTimeout(() => {
                    expect(include).toThrowError(
                        Error,
                        'include function called after conclusion'
                    );
                    if (++i === 3) done();
                });
            });

        });

    }, 100);

    describe('array of values resolved by conclusion promise', () => {

        it('should have all included values ordered by inclusion', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include(3);
                await new Promise((res) => { setTimeout(res); });
                include(4);
                include(2);
            });
            (async () => {
                const values = await iteration.promise();
                expect(values.length).toBe(3);
                expect(values[0]).toBe(3);
                expect(values[1]).toBe(4);
                expect(values[2]).toBe(2);
                done();
            })();
        }, 100);

    });

    describe('iteration function', () => {

        describe('result property', () => {

            it('should be an enumerable getter', () => {
                const fn = AsyncIteration(() => {}).iterate();
                const d = Object.getOwnPropertyDescriptor(fn, 'result');
                expect(d.get).not.toBeUndefined();
                expect(d.set).toBeUndefined();
                expect(d.enumerable).toBe(true);
                expect(d.configurable).toBe(false);
            });

        });

        it('always returns a promise', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include();
                include();
                await new Promise(setTimeout);
                include();
            });
            const iter = iteration.iterate();
            expect(iter() instanceof Promise).toBe(true);
            expect(iter() instanceof Promise).toBe(true);
            iter().then(iter).then(() => {
                expect(iter() instanceof Promise).toBe(true);
                done();
            });
        }, 100);

        it('promises the nth included value on its nth invocation', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include(3);
                include(4);
                await new Promise(setTimeout);
                include(2);
            });
            const iter = iteration.iterate();
            expect(iter.result).toBeUndefined();
            iter().then(() => { expect(iter.result).toBe(3); });
            iter().then(() => { expect(iter.result).toBe(4); });
            iter().then(() => { expect(iter.result).toBe(2); });
            iter().then(() => { expect(iter.result).toBeUndefined(); });
            iter().then(() => {
                expect(iter.result).toBeUndefined();
                done();
            });
        }, 100);

        it('aways resolves a boolean', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include();
                include();
                await new Promise(setTimeout);
                include();
            });
            const iter = iteration.iterate();
            iter().then((result) => { expect(typeof result).toBe('boolean'); });
            iter().then((result) => { expect(typeof result).toBe('boolean'); });
            iter().then((result) => { expect(typeof result).toBe('boolean'); });
            iter().then((result) => { expect(typeof result).toBe('boolean'); });
            iter().then((result) => {
                expect(typeof result).toBe('boolean');
                iter().then((result) => {
                    expect(typeof result).toBe('boolean');
                    done();
                });
            });
        }, 100);

        it('resolves false after iterating all values', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include();
                include();
                await new Promise(setTimeout);
                include();
            });
            (async () => {
                const iter = iteration.iterate();
                expect(await iter()).toBe(true);
                expect(await iter()).toBe(true);
                expect(await iter()).toBe(true);
                expect(await iter()).toBe(false);
                expect(await iter()).toBe(false);
                expect(await iter()).toBe(false);
                done();
            })();
        }, 100);

        it('rejects if the function passed to the factory rejects', (done) => {
            const iteration = AsyncIteration(async (include) => {
                include();
                await new Promise(setTimeout);
                include();
                await new Promise(setTimeout);
                throw Error('hai');
            });
            (async () => {
                var error = null;
                const iter = iteration.iterate();
                const fn = () => new Promise((res) => {
                    iter().then(res, (err) => {
                        error = err;
                        res();
                    });
                });
                await fn();
                expect(error).toBeNull();
                await fn();
                expect(error).toBeNull();
                await fn();
                expect(error instanceof Error).toBe(true);
                if (error) expect(error.message).toBe('hai');
                error = null;
                await fn();
                expect(error instanceof Error).toBe(true);
                if (error) expect(error.message).toBe('hai');
                done();
            })();
        }, 100);

    });

};

module.exports = test;
