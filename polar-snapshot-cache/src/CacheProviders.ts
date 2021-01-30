import {CacheKey, CacheProvider, TCacheDocTupleWithID, WriteDocRequest} from "./CacheProvider";
import {StoreCaches} from "./StoreCaches";
import {ICachedDoc} from "./ICachedDoc";
import {ICachedQuery} from "./ICachedQuery";
import {IndexedDBCacheProviders} from "./cache_providers/IndexedDBCacheProviders";
import {BenchmarkedCacheProviders} from "./cache_providers/BenchmarkedCacheProviders";

export namespace CacheProviders {

    import SnapshotBacking = StoreCaches.SnapshotBacking;

    export function create(backing: SnapshotBacking): CacheProvider {

        function createDelegate() {

            switch (backing) {

                case "none":
                    return createNullCacheProvider();

                case "IndexedDB":
                    return createIndexedDBCacheProvider();

            }

        }

        // return createDelegate();
        return BenchmarkedCacheProviders.create(createDelegate());

    }

    function createNullCacheProvider(): CacheProvider {

        async function purge() {
            // noop
        }

        async function writeDoc(request: WriteDocRequest) {
            // noop
        }

        async function writeDocs() {
            // noop
        }

        async function readDoc() {
            return undefined;
        }

        async function readDocs(): Promise<ReadonlyArray<ICachedDoc>> {
            return [];
        }

        async function writeQuery() {
            // noop
        }

        async function readQuery(): Promise<ICachedQuery | undefined> {
            return undefined;
        }


        async function remove() {
            // noop
        }


        return {purge, writeDoc, writeDocs, remove, readDoc, writeQuery, readQuery, readDocs};

    }


    function createIndexedDBCacheProvider(): CacheProvider {
        return IndexedDBCacheProviders.create();
    }

}
