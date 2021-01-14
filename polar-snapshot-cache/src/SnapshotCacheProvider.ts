export interface SnapshotCacheProvider {

    readonly purge: () => Promise<void>;

    /**
     * Return true if the cache contains teh given key.
     */
    readonly contains: (key: string) => Promise<boolean>;

    /**
     * Write to the cache.
     */
    readonly write: <V>(key: string, value: V) => Promise<void>;

    readonly read: <V>(key: string) => Promise<V | undefined>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
