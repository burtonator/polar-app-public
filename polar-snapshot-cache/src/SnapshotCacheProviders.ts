import {SnapshotCacheProvider} from "./SnapshotCacheProvider";
import {SnapshotCaches} from "./SnapshotCaches";

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

        async function contains(key: string): Promise<boolean> {
            return false;
        }

        async function write<V>(key: string, value: V) {
            // noop
        }

        async function remove(key: string) {
            // noop
        }

        async function read<V>(key: string): Promise<V | undefined> {
            return undefined;
        }

        return {purge, contains, write, remove, read};

    }

    function createLocalStorageSnapshotCacheProvider(): SnapshotCacheProvider {

        const prefix = 'snapshot-cache:';

        async function purge() {

            function computeKeys() {
                return Object.keys(localStorage).filter(current => current.startsWith(prefix));
            }

            for (const key of computeKeys()) {
                localStorage.removeItem(key);
            }

        }

        function createCacheKey(key: string) {
            return prefix + key;
        }

        async function contains(key: string): Promise<boolean> {
            const cacheKey = createCacheKey(key);
            return localStorage.getItem(cacheKey) !== null;
        }

        async function write<V>(key: string, value: V) {
            const cacheKey = createCacheKey(key);
            localStorage.setItem(cacheKey, JSON.stringify(value));
        }

        async function remove(key: string) {
            const cacheKey = createCacheKey(key);
            localStorage.removeItem(cacheKey);
        }


        async function read<V>(key: string): Promise<V | undefined> {

            const cacheKey = createCacheKey(key);
            const item = localStorage.getItem(cacheKey);

            if (item === null) {
                return undefined;
            }

            return JSON.parse(item);

        }

        return {purge, contains, write, remove, read};

    }

}