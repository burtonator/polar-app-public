import {isPresent} from '../Preconditions';

export type PrimitiveArray = ReadonlyArray<string | number | boolean>;

/**
 * A type that can be converted to an array.
 */
export type ToArrayLike<T> = ReadonlyArray<T> |
                            {[key: string]: T} |
                            {[key: number]: T} |
                            undefined |
                            null;

interface IArrayLike<T> {
    [key: number]: T,
    readonly length: number;
}

interface GroupedDict<V> {
    [key: string]: ReadonlyArray<V>;
}

interface MutableGroupedDict<V> {
    [key: string]: V[];
}


export interface IndexedValue<V> {
    readonly index: number;
    readonly value: V;
}

export namespace Arrays {

    // FIXME scan implementation..
    
    export function toIndexed<V>(values: ReadonlyArray<V>): ReadonlyArray<IndexedValue<V>> {

        const result = [];

        for (let index = 0; index < values.length; ++index) {
            result.push({index, value: values[index]});
        }

        return result;

    }

    export function groupBy<V>(values: ReadonlyArray<V>,
                              toKey: (value: V) => string): GroupedDict<V> {

        const result: MutableGroupedDict<V> = {};

        for (const value of values) {
            const key = toKey(value);

            const entry = result[key] || [];
            entry.push(value);
            result[key] = entry;

        }

        return result;

    }

    export function toArray<T>(value: ToArrayLike<T>): ReadonlyArray<T> {

        if (value === undefined || value === null) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        return Object.values(value);

    }

    export function onlyDefined<T>(values: ReadonlyArray<T | undefined>): ReadonlyArray<T> {

        return values.filter(current => current !== undefined)
                     .map(current => current!);

    }

    export function first<T>(values: ReadonlyArray<T>): T | undefined {

        if (! values) {
            return undefined;
        }

        if (values.length === 0) {
            return undefined;
        }

        return values[0];

    }

    export function last<T>(values: ReadonlyArray<T>): T | undefined {

        if (values.length === 0) {
            return undefined;
        }

        return values[values.length - 1];

    }

    /**
     * Take N samples from the given input.
     * @param values
     */
    export function sample<T>(values: T[], count: number) {

        if (count === 0) {
            return [];
        }

        if (values.length <= count) {
            // we're done and already have enough samples.
            return values;
        }

        const result: T[] = [];

        const gap = Math.floor(values.length / count);

        for (let idx = 0; idx < values.length; idx += gap) {
            result.push(values[idx]);
        }

        return result;

    }

    /**
     * Convert an array to a dictionary.
     */
    export function toDict(val: {} | any[]): {[key: string]: any} {

        const isObject = typeof val === "object";
        const isArray = val instanceof Array;

        if (! isObject && ! isArray) {
            // only needed if we're called from JS.  Otherwise the compiler
            // will check the type.
            throw new Error("Neither an object or an array.");
        }

        if (isObject && ! isArray) {
            // already done as this is a dictionary though we might consider
            // making this a
            return val;
        }

        if (! isArray) {
            throw new Error("Not an array");
        }

        const result: {[key: string]: any} = {};

        const arrayVal: any[] = <any[]> val;

        for (let idx = 0; idx < arrayVal.length; ++idx) {
            result[idx] = arrayVal[idx];
        }

        return result;

    }

    /**
     * Take the input and return it as batch of lists based on the size.
     *
     * For example, if the batchSize is 2, and the input is a array of
     * integers,
     * and we're given [1, 2, 3, 4, 5] we will return [[1,2],[3,4],[5]]
     *
     * If trailing is false we only return collections that are full, not
     * partial. This is the last few if they don't equal the size.
     *
     */
    export function createBatches<T>(input: ReadonlyArray<T>, batchSize: number): T[][] {

        const result: T[][] = [];

        let batch: T[] = [];

        input.forEach(current => {

            if (batch.length === batchSize) {
                result.push(batch);
                batch = [];
            }

            batch.push(current);

        });

        if (batch.length > 0) {
            result.push(batch);
        }

        return result;

    }

    /**
     * Like forEach but sequentially executes each function.
     */
    export async function asyncForEach<T>(items: T[], callback: AsyncCallback<T>) {

        for (const item of items) {
            await callback(item);
        }

    }

    /**
     * Shuffle the input as a new array.
     */
    export function shuffle<T>(...input: T[]): T[] {

        const arr = Object.assign([], input);

        // noinspection TsLint
        let j, x, i;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }

        return arr;

    }

    /**
     * Get up to `limit` values from the given input.
     */
    export function head<T>(input: ReadonlyArray<T>, limit: number): T[] {

        // adjust the limit so we never fetch too many values.
        limit = Math.min(limit, input.length);

        const result: T[] = [];

        for (let idx = 0; idx < limit; ++idx) {
            result[idx] = input[idx];
        }

        return result;

    }

    /**
     * Return true if the given `list` has any of the elements in `items`
     */
    export function hasAny<T>(list: ReadonlyArray<T>, items: ReadonlyArray<T>) {

        for (const item of items) {

            if (list.includes(item)) {
                return true;
            }

        }

        return false;

    }

    export function equal(a: PrimitiveArray, b: PrimitiveArray) {

        if (a === b) {
            return true;
        }

        if (a == null || b == null) {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;

    }

    /**
     * Compute the prev sibling in the array without dealing with array index math and just return an undefined if it does not exist.
     */
    export function prevSibling<T>(arr: IArrayLike<T>, index: number): T | undefined {

        const siblingIndex = index - 1;

        if (siblingIndex < 0) {
            return undefined;
        }

        return arr[siblingIndex];

    }

    /**
     * Compute the next sibling in the array without dealing with array index math and just return an undefined if it does not exist.
     */
    export function nextSibling<T>(arr: IArrayLike<T>, index: number): T | undefined {

        const siblingIndex = index + 1;

        if (siblingIndex >= arr.length) {
            return undefined;
        }

        return arr[siblingIndex];

    }

}

export type AsyncCallback<T> = (current: T) => Promise<void>;

/**
 * An array that might have missing items.
 */
export type SparseArray<T> = ReadonlyArray<T | undefined | null>;

export namespace SparseArrays {

    export function presentOnly<T>(values: SparseArray<T>): ReadonlyArray<T> {

        return values.filter(current => isPresent(current))
                      .map(current => current!);

    }

}

/**
 * Make this an array if it's given to us undefined by using a null object.
 */
export function asArray<T>(arr: ReadonlyArray<T> | undefined | null): ReadonlyArray<T> {

    if (arr) {
        return arr;
    }

    return [];

}
