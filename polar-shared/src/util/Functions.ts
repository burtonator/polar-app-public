import {isPresent, Preconditions} from "../Preconditions";

export class Functions {

    /**
     * Take a function and make it an external script we can pass to an external
     * javascript interpreter. This can be used with the electron renderer, chrome
     * headless, etc.
     *
     */
    public static functionToScript(func: (...args: any[]) => void, ...args: any[]): string {
        return this.toScript(func, ...args);

    }

    public static toScript(func: (...args: any[]) => void, ...args: any[]): string {

        // TODO: this doesn't yet support lambda functions.

        // TODO: the functions should not be bound with names.  They should be
        // anon to avoid conflicts with existing functions.

        if (!isPresent(func.name)) {
            throw new Error("Don't currently work with unnamed functions");
        }

        let result = "(";

        let functionBody = this._anonymizeFunction(func.toString());

        functionBody = functionBody.replace(/\) {/, ') => {');

        result += functionBody;
        result += "\n";

        if (args) {

            let funcArgs = JSON.stringify(args);

            funcArgs = funcArgs.substring(1, funcArgs.length);
            funcArgs = funcArgs.substring(0, funcArgs.length - 1);

            result += `)(${funcArgs});`;

        } else {
            result += `)();`;
        }

        return result;

    }


    public static _anonymizeFunction(func: string) {
        return func.substring(func.indexOf('('), func.length);
    }


    /**
     * We iterate over all keys in the dictionary.  Even inherited keys.
     *
     * @param dict
     * @param callback
     */
    public static forDict(dict: {[key: string]: any}, callback: KeyValueCallback) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        // get the keys first, that way we can mutate the dictionary while
        // iterating through it if necessary.
        const keys = Object.keys(dict);

        keys.forEach( (key: string) => {
            const value = dict[key];
            callback(key, value);
        });

    }

    /**
     * We iterate over all keys in the dictionary.
     *
     * @param dict
     * @param callback
     */
    public static async forOwnKeys(dict: {[key: string]: any}, callback: KeyValueCallback) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        for (const key in dict) {

            if (dict.hasOwnProperty(key)) {
                const value = dict[key];
                await callback(key, value);
            }

        }

    }

    /**
     * Calls the given callback as a promise which we can await.
     */
    public static withTimeout(callback: () => any, timeout: number = 1) {

        setTimeout(callback, timeout);

    }

    /**
     * A promise based timeout.  This just returns a promise which returns
     * once the timeout has expired. You can then call .then() or just await
     * the timeout.
     *
     * @param timeout {number}
     * @return {Promise<void>}
     */
    public static async waitFor(timeout: number) {

        return new Promise<boolean>(resolve => {

            setTimeout(() => {
                resolve(true);
            }, timeout);

        });

    }

    /**
     * Create a function that is a singleton and only runs once.
     */
    public static createAsyncSingleton(delegate: () => Promise<void>) {

        let executed: boolean = false;

        return async () => {

            if (executed) {
                return;
            }

            try {
                await delegate();
            } finally {
                executed = true;
            }

        };

    }

}

export type KeyValueCallback = (key: string, value: any) => void;

export function forDict(dict: {[key: string]: any}, callback: KeyValueCallback) {
    return Functions.forDict(dict, callback);
}

export function forOwnKeys(dict: {[key: string]: any}, callback: KeyValueCallback) {
    return Functions.forOwnKeys(dict, callback);
}

export function nullableCallback<T>(delegate: Callback1<T> | undefined) {
    return delegate || NULL_FUNCTION;
}

/**
 * A basic callback function.  No params and void return type.
 */
export type Callback = () => void;

/**
 * A callback with one argument.
 */
export type Callback1<A> = (value: A) => void;
export type Callback2<A, B> = (a: A, b: B) => void;
export type Callback3<A, B, C> = (a: A, b: B, c: C) => void;

export const NULL_FUNCTION = () => { /* no op */ };

export const ASYNC_NULL_FUNCTION = async () => { /* no op */ };

