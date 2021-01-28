import { ICachedDoc } from "./ICachedDoc";
import { ICachedQuery } from "./ICachedQuery";

export type CacheKey = string;

export type TCacheDocTupleWithID = [CacheKey, ICachedDoc];

export interface CacheProvider {

    /**
     * Write to the cache.
     */
    readonly writeDoc: (key: CacheKey, doc: ICachedDoc) => Promise<void>;

    readonly writeDocs: (docs: ReadonlyArray<TCacheDocTupleWithID>) => Promise<void>;

    readonly readDoc: (key: CacheKey) => Promise<ICachedDoc | undefined>;

    readonly readDocs: (keys: ReadonlyArray<CacheKey>) => Promise<ReadonlyArray<ICachedDoc>>;

    readonly writeQuery: (key: CacheKey, value: ICachedQuery) => Promise<void>;

    readonly readQuery: (key: CacheKey) => Promise<ICachedQuery | undefined>;

    readonly purge: () => Promise<void>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (key: string) => Promise<void>;

}
