import {Arrays} from "./Arrays";

export type ToKeyFunction<T> = (value: T, idx: number) => string;

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
 * Takes a value, and maps it in the index, which allows us to push it through
 * a stream and know the original index throughput the map.
 */
export interface IValueWithIndex<V> {
    readonly index: number;
    readonly value: V;
}

export type ScanTuple<V> = [V, boolean]
export type ScanHandler<T, V> = (record: T, index: number) => ScanTuple<V>;

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
     * Scan function that lets us can the array in any direction. So in theory
     * the same code could be use to on an underlying array just by changing the
     * delta.
     *
     * The handler needs to return a tuple with two values.  The first is the
     * mapped value, and the second is whether to continue.
     */
    public scan<V>(start: number,
                   delta: number,
                   handler: ScanHandler<T, V>) {

        // TODO just add a 'direction instead of delta...?

        // TODO: maybe the 'direction' should be computed internally during the
        // constructor and then I could use the internal map and filter commands
        // instead of a scan function.  This way I could compute the direction
        // mapping there and then have a map function that maps and returns true
        // or false depending if we should continue

        const result: V[] = [];

        for(let idx = start; idx >= 0 && idx < this.values.length; idx = idx + delta) {

            const value = this.values[idx];
            const [newValue, keepScanning] = handler(value, idx);

            result.push(newValue);

            if (! keepScanning) {
                break;
            }

        }

        return new ArrayStream(result);

    }

    /**
     * Debug handler to trace the state of the stream by giving you all the values
     * to call a function and debug.
     */
    public debug(handler: (values: ReadonlyArray<T>) => void): ArrayStream<T> {
        handler([...this.values]);
        return this;
    }

    public filter(predicate: (record: T, index: number) => boolean): ArrayStream<T> {
        const values = this.values.filter((record, index) => predicate(record, index));
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

        this.values.forEach((value, idx) => {
            const key = toKey(value, idx);
            set[key] = value;
        })

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

        this.values.forEach((value, idx) => {
            const key = toKey(value, idx);

            const entry = map[key] || [];
            map[key] = [...entry, value];
        })

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
     * Similar to group but we provide a predicate that computes whether two
     * consecutive items are part of the same group.
     *
     * @param predicate Return true if the two items belong to the same group.
     */
    public merge(predicate: (v0: T, v1: T) => boolean) {

        // FIXME/WARNING: I think this function isn't implemented correctly because
        // I'm not even using the predicate properly.

        let key: number = 0;
        let prev: T | undefined;

        function toKey(val: T): number {

            try {

                if (!prev) {
                    // this is the first record so obviously it's in its own key
                    return key;
                }

                if (val !== prev) {
                    ++key;
                }

                return key;

            } finally {
                prev = val;
            }

        }

        return this.group(val => '' + toKey(val));

    }

    /**
     * Map over the values, returning a new ArrayStream.
     */
    public map<V>(mapper: (record: T, index: number) => V): ArrayStream<V> {
        const mapped = this.values.map((record, index) => mapper(record, index));
        return new ArrayStream<V>(mapped);
    }

    // TODO: give it a default implementation of the function so it's just a
    // regular flatmap that doesn't need to convert the types.
    public flatMap<V>(mapper: (currentValue: T, index: number) => ReadonlyArray<V>): ArrayStream<V> {

        const result: V[] = [];

        for (let idx = 0; idx < this.values.length; ++idx) {
            const mapped = mapper(this.values[idx], idx);
            result.push(...mapped);
        }

        return new ArrayStream<V>(result);

    }

    public withIndex(): ArrayStream<IValueWithIndex<T>> {

        function toIndex(value: T, index: number): IValueWithIndex<T> {
            return {value, index};
        }

        return this.map(toIndex);

    }

    public first(): T | undefined {

        if (this.values.length > 0) {
            return this.values[0];
        }

        return undefined;

    }

    public last(): T | undefined {

        if (this.values.length > 0) {
            return this.values[this.values.length - 1];
        }

        return undefined;

    }

    public collect(): ReadonlyArray<T> {
        // TODO: think about adding a mapping function to the end with the
        // default to just map to ReadonlyArray<T>
        return [...this.values];
    }

    public transferTo(callback: (values: ReadonlyArray<T>) => void) {
        callback(this.values);
    }

    // TODO: this result should be readonly
    public toMap(toKey: ToKeyFunction<T> = defaultToKey): TypedDictionary<T> {

        const map: TypedDictionary<T> = {};

        this.values.forEach((value, idx) => {
            const key = toKey(value, idx);
            map[key] = value;
        });

        return map;

    }

    public toMap2<V>(toKey: (value: T, index: number) => string,
                    toValue: (value: T, index: number) => V ): {[key: string]: V} {

        const map: {[key: string]: V} = {};

        this.values.forEach((current, idx) => {
            const key = toKey(current, idx);
            const value = toValue(current, idx);
            map[key] = value;
        });

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
