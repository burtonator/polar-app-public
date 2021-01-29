import {CacheKey, TCacheDocTupleWithID} from "../CacheProvider";
import {ICachedDoc} from "../ICachedDoc";
import {ICachedQuery} from "../ICachedQuery";
import { get, set, del, clear, setMany, getMany} from 'idb-keyval';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace IndexedDBCacheProviders {

    export function create() {

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
        async function writeDoc(key: CacheKey, value: ICachedDoc) {
            await write(key, value);
        }

        async function writeDocs(docs: ReadonlyArray<TCacheDocTupleWithID>) {

            console.log("FIXME: writeDocs");

            try {
                await setMany([...docs]);
            } catch (e) {
                console.error("Unable to write cache entry: ", e);
            }

            console.log("FIXME: writeDocs");

        }

        async function readDoc(key: CacheKey): Promise<ICachedDoc | undefined> {
            return await read(key);
        }

        async function readDocs(keys: ReadonlyArray<CacheKey>): Promise<ReadonlyArray<ICachedDoc>> {

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

        async function writeQuery(key: CacheKey, value: ICachedQuery) {
            await write(key, value);
        }

        async function readQuery(key: CacheKey): Promise<ICachedQuery | undefined> {
            return await read(key);
        }

        async function remove(key: CacheKey) {
            await del(key);
        }

        async function purge() {
            await clear();
        }

        return {purge, writeDoc, writeDocs, remove, readDoc, readDocs, writeQuery, readQuery};

    }
}
