import {CacheKey, CacheProvider, TCacheDocTupleWithID} from "../CacheProvider";
import {ICachedDoc} from "../ICachedDoc";
import {ICachedQuery} from "../ICachedQuery";

export namespace BenchmarkedCacheProviders {

    export function create(delegate: CacheProvider) {

        async function withBenchmark<V>(op: string, delegate: () => Promise<V>) {

            const before = Date.now();

            try {

                return await delegate();

            } finally {
                const after = Date.now();
                const duration = after - before;
                console.log(`cache latency for ${op}: ${duration}ms`)
            }

        }

        async function writeDoc(key: CacheKey, value: ICachedDoc) {
            return await withBenchmark('writeDoc', async () => delegate.writeDoc(key, value))
        }

        async function writeDocs(docs: ReadonlyArray<TCacheDocTupleWithID>) {
            return await withBenchmark('writeDocs', async () => delegate.writeDocs(docs))
        }

        async function readDoc(key: CacheKey): Promise<ICachedDoc | undefined> {
            return await withBenchmark('readDoc', async () => delegate.readDoc(key))
        }

        async function readDocs(keys: ReadonlyArray<CacheKey>): Promise<ReadonlyArray<ICachedDoc>> {
            return await withBenchmark('readDocs', async () => delegate.readDocs(keys))
        }

        async function writeQuery(key: CacheKey, value: ICachedQuery) {
            return await withBenchmark('writeQuery', async () => delegate.writeQuery(key, value))
        }

        async function readQuery(key: CacheKey): Promise<ICachedQuery | undefined> {
            return await withBenchmark('readQuery', async () => delegate.readQuery(key))
        }

        async function remove(key: CacheKey) {
            return await withBenchmark('remove', async () => delegate.remove(key))
        }

        async function purge() {
            return await withBenchmark('purge', async () => delegate.purge())
        }

        return {purge, writeDoc, writeDocs, remove, readDoc, readDocs, writeQuery, readQuery};

    }
}
