import {SnapshotCacheProvider} from "./SnapshotCacheProvider";
import {SnapshotCaches} from "./SnapshotCaches";
import {ISnapshotCachedDoc} from "./ISnapshotCachedDoc";
import {ISnapshotCachedQuery} from "./ISnapshotCachedQuery";

export namespace SnapshotCacheProviders {

    import SnapshotBacking = SnapshotCaches.SnapshotBacking;

    export function create(backing: SnapshotBacking): SnapshotCacheProvider {

        switch (backing) {

            case "none":
                return createNullSnapshotCacheProvider();
            case "localStorage":
                return createLocalStorageSnapshotCacheProvider();

        }

    }

    function createNullSnapshotCacheProvider(): SnapshotCacheProvider {

        async function purge() {
            // noop
        }

        async function writeDoc(key: string, value: ISnapshotCachedDoc) {
            // noop
        }

        async function readDoc(key: string): Promise<ISnapshotCachedDoc | undefined> {
            return undefined;
        }

        async function writeQuery(key: string, value: ISnapshotCachedQuery) {
            // noop
        }

        async function readQuery(key: string): Promise<ISnapshotCachedQuery | undefined> {
            return undefined;
        }


        async function remove(key: string) {
            // noop
        }


        return {purge, writeDoc, remove, readDoc, writeQuery, readQuery};

    }

    function createLocalStorageSnapshotCacheProvider(): SnapshotCacheProvider {

        const prefix = 'snapshot-cache:';

        function createCacheKey(key: string) {
            return prefix + key;
        }

        async function write<V>(key: string, value: V) {
            const cacheKey = createCacheKey(key);
            localStorage.setItem(cacheKey, JSON.stringify(value));
        }


        async function read<V>(key: string): Promise<V | undefined> {

            const cacheKey = createCacheKey(key);
            const item = localStorage.getItem(cacheKey);

            if (item === null) {
                return undefined;
            }

            return JSON.parse(item);

        }
        async function writeDoc(key: string, value: ISnapshotCachedDoc) {
            await write(key, value);
        }

        async function readDoc(key: string): Promise<ISnapshotCachedDoc | undefined> {
            return await read(key);
        }


        async function writeQuery(key: string, value: ISnapshotCachedQuery) {
            await write(key, value);
        }

        async function readQuery(key: string): Promise<ISnapshotCachedQuery | undefined> {
            return await read(key);
        }

        async function remove(key: string) {
            const cacheKey = createCacheKey(key);
            localStorage.removeItem(cacheKey);
        }

        async function purge() {

            function computeKeys() {
                return Object.keys(localStorage).filter(current => current.startsWith(prefix));
            }

            for (const key of computeKeys()) {
                localStorage.removeItem(key);
            }

        }

        return {purge, writeDoc, remove, readDoc, writeQuery, readQuery};

    }

}