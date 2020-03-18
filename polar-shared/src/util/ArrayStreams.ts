import {Arrays} from "./Arrays";

export type ToKeyFunction<T> = (value: T) => string;

function defaultToKey(value: any): string {

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number') {
        return '' + value;
    }

    throw new Error("Must be string or number");

}

export interface TypedDictionary<T> {
    [key: string]: T;
}

/**
 * Similar to Java streams but for Javascript/Typescript arrays.
 *
 * This is also similar to lodash but a lot simpler and with fewer dependencies.
 *
 * One issue is that this doesn't do anything smart with head/collect which
 * are some performance optimizations in Java streams.
 */
export class ArrayStream<T> {

    constructor(private values: ReadonlyArray<T>) {
    }

    public filter(predicate: (record: T) => boolean): ArrayStream<T> {
        this.values = this.values.filter(record => predicate(record));
        return this;
    }

    public head(limit: number): ArrayStream<T> {
        this.values = Arrays.head(this.values, limit);
        return this;
    }

    public sort(compareFn: (a: T, b: T) => number): ArrayStream<T> {
        this.values = [...this.values].sort((a, b) => compareFn(a, b));
        return this;
    }

    public unique(toKey: ToKeyFunction<T> = defaultToKey): ArrayStream<T> {

        const set: {[key: string]: T} = {};

        for (const value of this.values) {
            const key = toKey(value);
            set[key] = value;
        }

        return new ArrayStream(Object.values(set));

    }

    public reverse(): ArrayStream<T> {
        const reversed = [...this.values].reverse();
        return new ArrayStream(reversed);
    }

    // public tail(limit: number): ArrayStream<T> {
    //     this.values = Arrays.tail(this.values, limit);
    //     return this;
    // }

    /**
     * Create groups by key and return the groups as a stream.
     */
    public group(toKey: ToKeyFunction<T> = defaultToKey): ArrayStream<ReadonlyArray<T>> {

        const map: {[key: string]: ReadonlyArray<T>} = {};

        for (const value of this.values) {
            const key = toKey(value);

            const entry = map[key] || [];
            map[key] = [...entry, value];
        }

        return new ArrayStream<ReadonlyArray<T>>(Object.values(map));

    }

    /**
     * Map over the values, returning a new ArrayStream.
     */
    public map<V>(mapper: (record: T) => V): ArrayStream<V> {
        const mapped = this.values.map(record => mapper(record));
        return new ArrayStream<V>(mapped);
    }

    public first(): T | undefined {

        if (this.values.length > 0) {
            return this.values[0];
        }

        return undefined;

    }

    public collect(): ReadonlyArray<T> {
        return [...this.values];
    }

    // TODO: this result should be readonly
    public toMap(toKey: ToKeyFunction<T> = defaultToKey): TypedDictionary<T> {

        const map: TypedDictionary<T> = {};

        for (const value of this.values) {
            const key = toKey(value);
            map[key] = value;
        }

        return map;

    }

}

export function arrayStream<T>(values: ReadonlyArray<T>): ArrayStream<T> {
    return new ArrayStream<T>(values);
}

export class ArrayStreams {

    public static create<T>(values: ReadonlyArray<T>): ArrayStream<T> {
        return new ArrayStream<T>(values);
    }

}
