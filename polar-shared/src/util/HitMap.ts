import { Dictionaries } from "./Dictionaries";
import {Reducers} from "./Reducers";
import {ArrayListMultimap, Multimap} from "./Multimap";
import {Arrays} from "./Arrays";

/**
 * Keeps track of hits for a given key...
 */
export class HitMap {

    private index: {[key: string]: HitEntry} = {};

    public registerHit(key: string, delta: number = 1): number {

        const entry = Dictionaries.computeIfAbsent(this.index, key, () => {
            return {key, value: 0};
        });

        return entry.value += delta;

    }

    public registerHits(...keys: string[]) {

        for (const key of keys) {
            this.registerHit(key);
        }

    }


    /**
     * Return the hit index as a map.
     */
    public toMap(): Readonly<{[key: string]: HitEntry}> {
        return Object.freeze({...this.index});
    }

    public toArray(): ReadonlyArray<HitEntry> {
        return Object.freeze(Object.values(this.index));
    }

    /**
     * Return a map of key to hits without an entry object.
     */
    public toLiteralMap(): LiteralMap {

        const result: LiteralMap = {};

        for (const key of Object.keys(this.index)) {
            result[key] = this.index[key].value;
        }

        return result;

    }

    /**
     * Return the HitMap entries ranked.
     */
    public toRanked(): ReadonlyArray<HitEntry> {

        return Object.values(this.toMap())
            .sort((a, b) => b.value - a.value);

    }

    public toPercRanked(total?: number): ReadonlyArray<PercRankedEntry> {

        const ranked = this.toRanked();

        if (total === undefined) {
            total = Object.values(ranked)
                .map(current => current.value)
                .reduce(Reducers.SUM, 0);

        }

        let idx = 1;
        return ranked.map(current => {

            return {
                idx: idx++,
                key: current.key,
                hits: current.value,
                perc: Math.floor((current.value / total!)  * 100)
            };

        });

    }

}

/**
 * A HitMap impl that uses a Multimap to keep the values as well for reporting.
 */
export class SampledHitMap<V> {

    private hitMap = new HitMap();

    private multiMap: Multimap<string, V> = new ArrayListMultimap();

    public registerHit(key: string, value: V): void {
        this.hitMap.registerHit(key);
        this.multiMap.put(key, value);
    }


    /**
     *
     * @param nrSamples the max samples per entry.
     * @param total
     */
    public toPercRanked(nrSamples: number,
                        total?: number): ReadonlyArray<SampledPercRankedEntry<V>> {

        const ranked = this.hitMap.toRanked();

        if (total === undefined) {
            total = Object.values(ranked)
                .map(current => current.value)
                .reduce(Reducers.SUM, 0);

        }

        let idx = 1;
        return ranked.map(current => {

            const samples =
                Arrays.head(
                    Arrays.shuffle(...this.multiMap.get(current.key)), nrSamples);

            return {
                idx: idx++,
                key: current.key,
                hits: current.value,
                perc: Math.floor((current.value / total!)  * 100),
                samples
            };

        });

    }

}

interface HitEntry {
    key: string;
    value: number;
}

export interface PercRankedEntry {
    readonly idx: number;
    readonly key: string;
    readonly hits: number;
    readonly perc: number;
}

export interface SampledPercRankedEntry<V> extends PercRankedEntry {
    readonly samples: ReadonlyArray<V>;
}

export interface LiteralMap {
    [key: string]: number;
}

