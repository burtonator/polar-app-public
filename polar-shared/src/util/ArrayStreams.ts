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

export type PartitionKey<K> = [string, K];

export type ToPartitionKeyFunction<K, T> = (value: T) => PartitionKey<K>;

export interface MutablePartition<K, V> {
    readonly id: string;
    readonly key: K;
    readonly values: V[];
}

export interface Partition<K, V> {
    readonly id: string;
    readonly key: K;
    readonly values: ReadonlyArray<V>;
}

export type PartitionMap<K, V> = Readonly<{[id: string]: MutablePartition<K, V>}>;

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

    /**
     * Debug handler to trace the state of the stream by giving you all the values
     * to call a function and debug.
     */
    public debug(handler: (values: ReadonlyArray<T>) => void): ArrayStream<T> {
        handler([...this.values]);
        return this;
    }

    public filter(predicate: (record: T) => boolean): ArrayStream<T> {
        const values = this.values.filter(record => predicate(record));
        return new ArrayStream<T>(values);
    }

    public head(limit: number): ArrayStream<T> {
        const values = Arrays.head(this.values, limit);
        return new ArrayStream<T>(values);
    }

    public sort(compareFn: (a: T, b: T) => number): ArrayStream<T> {
        const values = [...this.values].sort((a, b) => compareFn(a, b));
        return new ArrayStream<T>(values);
    }

    public shuffle(): ArrayStream<T> {
        const values = Arrays.shuffle(...this.values);
        return new ArrayStream<T>(values);
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
     * Similar ot 'group' but each partition has a key as a string, a value
     * that represents that key, and a number of items under that key.
     */
    public partition<K>(toPartitionKey: ToPartitionKeyFunction<K, T>): PartitionMap<K, T> {

        const map: {[id: string]: MutablePartition<K, T>} = {};

        for (const value of this.values) {
            const [id, key] = toPartitionKey(value);

            const entry = map[id] || {
                id,
                key,
                values: []
            };

            entry.values.push(value);

            map[id] = entry;
        }

        return map;

    }


    /**
     * Map over the values, returning a new ArrayStream.
     */
    public map<V>(mapper: (record: T) => V): ArrayStream<V> {
        const mapped = this.values.map(record => mapper(record));
        return new ArrayStream<V>(mapped);
    }

    /**
     * Map over the values, returning a new ArrayStream.
     */
    public flatMap<V>(mapper: (currentValue: T, index: number) => ReadonlyArray<V>): ArrayStream<V> {

        const result: V[] = [];

        for (let idx = 0; idx < this.values.length; ++idx) {
            const mapped = mapper(this.values[idx], idx);
            result.push(...mapped);
        }

        return new ArrayStream<V>(result);

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

    public transferTo(callback: (values: ReadonlyArray<T>) => void) {
        callback(this.values);
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

export namespace ArrayStreams {

    export function create<T>(values: ReadonlyArray<T>): ArrayStream<T> {
        return new ArrayStream<T>(values);
    }

    export function ofMapValues<T>(values: {[key: string]: T} | null | undefined): ArrayStream<T> {
        return new ArrayStream<T>(Object.values(values || {}));
    }

}
