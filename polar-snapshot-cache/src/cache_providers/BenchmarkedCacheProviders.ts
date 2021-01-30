import {
    CacheProvider,
    ReadDocRequest, ReadDocsRequest, ReadQueryRequest, RemoveRequest,
    WriteDocRequest,
    WriteDocsRequest, WriteQueryRequest
} from "../CacheProvider";
import {ICachedDoc} from "../ICachedDoc";
import {ICachedQuery} from "../ICachedQuery";

export namespace BenchmarkedCacheProviders {

    export function create(delegate: CacheProvider) {

        async function withBenchmark<V>(desc: string, delegate: () => Promise<V>) {

            const before = Date.now();

            try {

                return await delegate();

            } finally {
                const after = Date.now();
                const duration = after - before;
                console.log(`cache latency for ${desc}: ${duration}ms`)
            }

        }

        async function writeDoc(request: WriteDocRequest) {
            const {doc} = request;
            return await withBenchmark('writeDoc:' + doc.collection , async () => delegate.writeDoc(request))
        }

        async function writeDocs(request: WriteDocsRequest) {
            return await withBenchmark('writeDocs: count=' + request.docs.length, async () => delegate.writeDocs(request))
        }

        async function readDoc(request: ReadDocRequest): Promise<ICachedDoc | undefined> {
            return await withBenchmark('readDoc:' + request.collection, async () => delegate.readDoc(request))
        }

        async function readDocs(request: ReadDocsRequest): Promise<ReadonlyArray<ICachedDoc>> {
            return await withBenchmark('readDocs: count=' + request.keys.length, async () => delegate.readDocs(request))
        }

        async function writeQuery(request: WriteQueryRequest) {
            return await withBenchmark('writeQuery:' + request.query.collection, async () => delegate.writeQuery(request))
        }

        async function readQuery(request: ReadQueryRequest): Promise<ICachedQuery | undefined> {
            return await withBenchmark('readQuery: ' + request.collection, async () => delegate.readQuery(request))
        }

        async function remove(request: RemoveRequest) {
            return await withBenchmark('remove', async () => delegate.remove(request))
        }

        async function purge() {
            return await withBenchmark('purge', async () => delegate.purge())
        }

        return {purge, writeDoc, writeDocs, remove, readDoc, readDocs, writeQuery, readQuery};

    }
}
