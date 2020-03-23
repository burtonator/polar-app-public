import {isPresent} from "../Preconditions";

export interface InnerMap<V> {
    [key: string]: V;
}

export type ToKeyFunction<V> = (value: V) => string;

/**
 * A Multimap that cannot hold duplicate key-value pairs. Adding a key-value
 * pair that's already in the multimap has no effect. See the Multimap
 * documentation for information common to all multimaps.
 */
export class SetMultimap<K, V> {

    private backing: {[key: string]: InnerMap<V>} = {};

    constructor(private readonly keyToKey: ToKeyFunction<K>,
                private readonly valueToKey: ToKeyFunction<V>) {
    }

    public put(key: K, value: V): void {

        const id = this.keyToKey(key);

        const getOrCreateInnerMap = () => {

            const innerMap = this.backing[id];

            if (innerMap) {
                return innerMap;
            } else {
                this.backing[id] = {};
                return this.backing[id];
            }

        };

        const innerMap = getOrCreateInnerMap();

        innerMap[this.valueToKey(value)] = value;

    }

    public putAll(key: K, values: ReadonlyArray<V>) {

        // TODO: we could make a more optimal verison of this in the future
        for(const value of values) {
            this.put(key, value);
        }
    }

    public get(key: K): ReadonlyArray<V> {
        const id = this.keyToKey(key);

        const innerMap = this.backing[id];

        if (innerMap) {
            return Object.values(innerMap);
        }

        return [];

    }

    public delete(key: K): boolean {
        const id = this.keyToKey(key);
        return delete this.backing[id];
    }

    /**
     * Filter the values under a key with the given predicate.
     */
    public filter(key: K, predicate: (value: V) => boolean) {

        const id = this.keyToKey(key);

        const innerMap = this.backing[id] ?? {};
        const entries = Object.entries(innerMap);

        for (const entry of entries) {
            const k = entry[0];
            const v = entry[1];

            if (! predicate(v)) {
                delete innerMap[k];
            }

        }

    }

    public containsKey(key: K): boolean {
        const id = this.keyToKey(key);
        return isPresent(this.backing[id]);
    }

}

