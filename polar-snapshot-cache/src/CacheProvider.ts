import { ICachedDoc } from "./ICachedDoc";
import { ICachedQuery } from "./ICachedQuery";

export type CacheKey = string;

export type TCacheDocTupleWithID = [CacheKey, ICachedDoc];

export interface WriteDocRequest {
    readonly key: CacheKey;
    readonly doc: ICachedDoc;
}

export interface WriteDocsRequest {
    // NOTE: WriteDocsRequest can not have a collection because
    // batches can update docs in any collection
    readonly docs: ReadonlyArray<TCacheDocTupleWithID>
}

export interface ReadDocRequest {
    readonly key: CacheKey;
    readonly collection: string;
}

export interface ReadDocsRequest {
    readonly keys: ReadonlyArray<CacheKey>;
    readonly collection: string;
}

export interface WriteQueryRequest {
    readonly key: CacheKey;
    readonly query: ICachedQuery;
}

export interface ReadQueryRequest {
    readonly key: CacheKey;
    readonly collection: string;
}

export interface RemoveRequest {
    readonly key: CacheKey;
    readonly collection: string;
}

export interface CacheProvider {

    /**
     * Write to the cache.
     */
    readonly writeDoc: (request: WriteDocRequest) => Promise<void>;

    readonly writeDocs: (request: WriteDocsRequest) => Promise<void>;

    readonly readDoc: (request: ReadDocRequest) => Promise<ICachedDoc | undefined>;

    readonly readDocs: (request: ReadDocsRequest) => Promise<ReadonlyArray<ICachedDoc>>;

    readonly writeQuery: (request: WriteQueryRequest) => Promise<void>;

    readonly readQuery: (request: ReadQueryRequest) => Promise<ICachedQuery | undefined>;

    readonly purge: () => Promise<void>;

    /**
     * Remove an item from the cache.
     */
    readonly remove: (request: RemoveRequest) => Promise<void>;

}
