import {isPresent, Preconditions} from "../Preconditions";
import {Optional} from "./ts/Optional";

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
    public static async withTimeout(callback: () => any, timeout: number = 1) {

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

        return new Promise(resolve => {

            setTimeout(() => {
                resolve();
            }, timeout);

        });

    }

    /**
     *
     * @Deprecated use createSiblings as createSiblingTuples implies that this
     * is a tuple and it's actually a triple.
     */
    public static createSiblingTuples(arrayLikeObject: any) {
        return Functions.createSiblings(arrayLikeObject);
    }

    /**
     * Go over the array-like object and return tuples with prev, curr, and next
     * properties so that we can peek at siblings easily.  If the prev and / or
     * next are not present these values are null.
     *
     * This can be used for algorithms that need to peek ahead or behind
     * inside an iterative algorithm
     *
     * @param arrayLikeObject {Array<any>}
     * @return {Array<ArrayPosition>}
     * @Deprecated use Tuples.createSiblings
     */
    public static createSiblings(arrayLikeObject: any) {

        Preconditions.assertNotNull(arrayLikeObject, "arrayLikeObject");

        const result: IArrayPosition<any>[] = [];

        for (let idx = 0; idx < arrayLikeObject.length; ++idx) {

            result.push({
                curr: arrayLikeObject[idx],
                prev: Optional.of(arrayLikeObject[idx - 1]).getOrElse(null),
                next: Optional.of(arrayLikeObject[idx + 1]).getOrElse(null)
            });

        }

        return result;

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

/**
 * Represents a 'position' object for createSiblings() that has a curr
 * (current), prev (previous), and next references for working with lists of
 * objects.  The position allow sus to know where we currently are but also the
 * previous and future states.
 */
export interface IArrayPosition<T> {

    readonly prev?: T;

    readonly curr: T;

    readonly next?: T;

}

export type KeyValueCallback = (key: string, value: any) => void;

export function forDict(dict: {[key: string]: any}, callback: KeyValueCallback) {
    return Functions.forDict(dict, callback);
}

export function forOwnKeys(dict: {[key: string]: any}, callback: KeyValueCallback) {
    return Functions.forOwnKeys(dict, callback);
}

export function createSiblingTuples(arrayLikeObject: any) {
    return Functions.createSiblingTuples(arrayLikeObject);
}

export function createSiblings(arrayLikeObject: any) {
    return Functions.createSiblings(arrayLikeObject);
}

/**
 * A basic callback function.  No params and void return type.
 */
export type Callback = () => void;

/**
 * A callback with one argument.
 */
export type Callback1<T> = (value: T) => void;

export const NULL_FUNCTION = () => { /* no op */ };

export const ASYNC_NULL_FUNCTION = async () => { /* no op */ };

