import { ISnapshotCachedDoc } from "./ISnapshotCachedDoc";
import { ISnapshotCachedQuery } from "./ISnapshotCachedQuery";

export interface SnapshotCacheProvider {

    /**
     * Write to the cache.
     */
    readonly writeDoc: (key: string, value: ISnapshotCachedDoc) => Promise<void>;

    readonly readDoc: (key: string) => Promise<ISnapshotCachedDoc | undefined>;

    readonly writeQuery: (key: string, value: ISnapshotCachedQuery) => Promise<void>;

    readonly readQuery: (key: string) => Promise<ISnapshotCachedQuery | undefined>;

    readonly purge: () => Promise<void>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
