import {CacheKey, CacheProvider, TCacheDocTupleWithID} from "./CacheProvider";
import {StoreCaches} from "./StoreCaches";
import {ICachedDoc} from "./ICachedDoc";
import {ICachedQuery} from "./ICachedQuery";
import {IndexedDBCacheProviders} from "./cache_providers/IndexedDBCacheProviders";

export namespace CacheProviders {

    import SnapshotBacking = StoreCaches.SnapshotBacking;

    export function create(backing: SnapshotBacking): CacheProvider {

        switch (backing) {

            case "none":
                return createNullCacheProvider();

            case "IndexedDB":
                return createIndexedDBCacheProvider();

        }

    }

    function createNullCacheProvider(): CacheProvider {

        async function purge() {
            // noop
        }

        async function writeDoc(key: CacheKey, value: ICachedDoc) {
            // noop
        }

        async function writeDocs(docs: ReadonlyArray<TCacheDocTupleWithID>) {
            // noop
        }

        async function readDoc(key: CacheKey): Promise<ICachedDoc | undefined> {
            return undefined;
        }

        async function readDocs(keys: ReadonlyArray<CacheKey>): Promise<ReadonlyArray<ICachedDoc>> {
            return [];
        }

        async function writeQuery(key: CacheKey, value: ICachedQuery) {
            // noop
        }

        async function readQuery(key: CacheKey): Promise<ICachedQuery | undefined> {
            return undefined;
        }


        async function remove(key: string) {
            // noop
        }


        return {purge, writeDoc, writeDocs, remove, readDoc, writeQuery, readQuery, readDocs};

    }


    function createIndexedDBCacheProvider(): CacheProvider {
        return IndexedDBCacheProviders.create();
    }

}
