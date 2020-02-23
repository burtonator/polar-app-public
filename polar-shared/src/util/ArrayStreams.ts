import {Arrays} from "./Arrays";

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

    // public tail(limit: number): ArrayStream<T> {
    //     this.values = Arrays.tail(this.values, limit);
    //     return this;
    // }

    /**
     * Map over the values, returning a new ArrayStream.
     */
    public map<V>(mapper: (record: T) => V): ArrayStream<V> {
        const mapped = this.values.map(record => mapper(record));
        return new ArrayStream<V>(mapped);
    }

    public collect(): ReadonlyArray<T> {
        return [...this.values];
    }

}

export class ArrayStreams {

    public static create<T>(values: ReadonlyArray<T>): ArrayStream<T> {
        return new ArrayStream<T>(values);
    }

}
