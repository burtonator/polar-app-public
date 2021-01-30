import {
    CacheKey,
    CacheProvider,
    ReadDocRequest, ReadDocsRequest, ReadQueryRequest, RemoveRequest,
    WriteDocRequest,
    WriteDocsRequest, WriteQueryRequest
} from "../CacheProvider";
import {ICachedDoc} from "../ICachedDoc";
import {ICachedQuery} from "../ICachedQuery";
import { get, set, del, clear, setMany, getMany} from 'idb-keyval';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace IndexedDBCacheProviders {

    export function create(): CacheProvider {

        let hits: number = 0;
        let misses: number = 0;

        async function write<V>(key: CacheKey, value: V) {

            try {
                await set(key, value);
            } catch (e) {
                console.error("Unable to write cache entry: ", e);
            }

        }

        async function read<V>(key: CacheKey): Promise<V | undefined> {

            try {

                const item = await get(key);

                if (item === null) {
                    return undefined;
                }

                return item;

            } catch (e) {
                console.error("Unable to read cache entry: ", e);
                return undefined;
            }

        }
        async function writeDoc(request: WriteDocRequest) {
            const {key, doc} = request;
            await write(key, doc);
        }

        async function writeDocs(request: WriteDocsRequest) {

            if (request.docs.length === 0) {
                return;
            }

            try {
                await setMany([...request.docs]);
            } catch (e) {
                console.error("Unable to write cache entry: ", e);
            }

        }

        async function readDoc(request: ReadDocRequest): Promise<ICachedDoc | undefined> {
            return await read(request.key);
        }

        async function readDocs(request: ReadDocsRequest): Promise<ReadonlyArray<ICachedDoc>> {

            const {keys} = request;

            if (request.keys.length === 0) {
                return [];
            }

            try {

                const docs: ReadonlyArray<ICachedDoc> = await getMany([...keys]);

                // convert this to a map and then reconstruct by ID...

                const index = arrayStream(docs).toMap(current => current.id);

                hits += docs.length;
                misses += (keys.length - docs.length)

                return keys.map(key => index[key]);

            } catch (e) {
                console.error("Unable to read docs from cache: ", e);
                return [];
            }
        }

        async function writeQuery(request: WriteQueryRequest) {
            const {key, query} = request
            await write(key, query);
        }

        async function readQuery(request: ReadQueryRequest): Promise<ICachedQuery | undefined> {
            return await read(request.key);
        }

        async function remove(request: RemoveRequest) {
            await del(request.key);
        }

        async function purge() {
            await clear();
        }

        return {purge, writeDoc, writeDocs, remove, readDoc, readDocs, writeQuery, readQuery};

    }
}
