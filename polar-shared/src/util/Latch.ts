/**
 * A latch that can be resolved. Like a ResolvablePromise by
 */
export class Latch<T> {

    private promise: Promise<T>;

    // noinspection TsLint
    private _resolve: (value: T) => void = () => {
    };

    // noinspection TsLint
    private _reject: (reason: any) => void = () => {
    };

    constructor() {

        this.promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

    }

    // NOTE: typescript to javascript will properly serialize methods into
    // the IPC renderer when assigning methods to properties as they are then
    // enumerable.

    // noinspection TsLint
    public resolve = (value: T) => {
        this._resolve(value);
    }

    // noinspection TsLint
    public reject = (reason: any) => {
        this._reject(reason);
    }

    // noinspection TsLint
    public get = (): Promise<T> => {
        return this.promise;
    }

}
