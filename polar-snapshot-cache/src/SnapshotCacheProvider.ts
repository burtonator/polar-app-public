import { ISnapshotCachedDoc } from "./ISnapshotCachedDoc";

export interface SnapshotCacheProvider {

    readonly purge: () => Promise<void>;

    /**
     * Write to the cache.
     */
    readonly writeDoc: <V>(key: string, value: ISnapshotCachedDoc<V>) => Promise<void>;

    readonly readDoc: <V>(key: string) => Promise<ISnapshotCachedDoc<V> | undefined>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
