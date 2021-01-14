import { ICachedDoc } from "./ICachedDoc";
import { ICachedQuery } from "./ICachedQuery";

export interface CacheProvider {

    /**
     * Write to the cache.
     */
    readonly writeDoc: (key: string, value: ICachedDoc) => Promise<void>;

    readonly readDoc: (key: string) => Promise<ICachedDoc | undefined>;

    readonly writeQuery: (key: string, value: ICachedQuery) => Promise<void>;

    readonly readQuery: (key: string) => Promise<ICachedQuery | undefined>;

    readonly purge: () => Promise<void>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
