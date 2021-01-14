import { ICachedDoc } from "./ICachedDoc";
import { ISnapshotCachedQuery } from "./ISnapshotCachedQuery";

export interface CacheProvider {

    /**
     * Write to the cache.
     */
    readonly writeDoc: (key: string, value: ICachedDoc) => Promise<void>;

    readonly readDoc: (key: string) => Promise<ICachedDoc | undefined>;

    readonly writeQuery: (key: string, value: ISnapshotCachedQuery) => Promise<void>;

    readonly readQuery: (key: string) => Promise<ISnapshotCachedQuery | undefined>;

    readonly purge: () => Promise<void>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
