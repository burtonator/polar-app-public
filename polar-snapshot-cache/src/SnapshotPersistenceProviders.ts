import {SnapshotPersistenceProvider} from "./SnapshotPersistenceProvider";
import {SnapshotCache} from "./SnapshotCache";
import {showWarningOnce} from "tslint/lib/error";

export namespace SnapshotPersistenceProviders {

    import SnapshotBacking = SnapshotCache.SnapshotBacking;

    export function create(backing: SnapshotBacking): SnapshotPersistenceProvider {

        switch (backing) {

            case "none":
                return createNullSnapshotPersistenceProvider();
            case "localStorage":
                return createLocalStorageSnapshotPersistenceProvider();

        }

    }

    function createNullSnapshotPersistenceProvider(): SnapshotPersistenceProvider {

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

    function createLocalStorageSnapshotPersistenceProvider(): SnapshotPersistenceProvider {

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