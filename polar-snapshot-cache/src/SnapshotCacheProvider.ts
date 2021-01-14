import { ISnapshotCachedDoc } from "./ISnapshotCachedDoc";

export interface SnapshotCacheProvider {

    readonly purge: () => Promise<void>;

    /**
     * Write to the cache.
     */
    readonly writeDoc: (key: string, value: ISnapshotCachedDoc) => Promise<void>;

    readonly readDoc: (key: string) => Promise<ISnapshotCachedDoc | undefined>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
