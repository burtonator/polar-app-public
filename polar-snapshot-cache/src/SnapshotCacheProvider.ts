import { ISnapshotCacheEntry } from "./ISnapshotCacheEntry";

export interface SnapshotCacheProvider {

    readonly purge: () => Promise<void>;

    /**
     * Write to the cache.
     */
    readonly write: <V>(key: string, value: ISnapshotCacheEntry<V>) => Promise<void>;

    readonly read: <V>(key: string) => Promise<ISnapshotCacheEntry<V> | undefined>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
