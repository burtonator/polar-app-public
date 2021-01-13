export namespace SnapshotCache {

    export interface Config {
        readonly backing: 'none' | 'localStorage';
    }

    let config: Config = {
        backing: 'none'
    }

    /**
     * Purge all data in the snapshot cache using the current configuration
     */
    export async function purge() {
        // noop for now
    }

    /**
     * Configure how the snapshot cache works, whether it's enabled, etc.
     */
    export function configure(newConfig: Config) {
        config = newConfig;
    }

    // FIXME: we need to CREATE a snapshotter , and it will internally have a
    // key factory

    /**
     * TODO:
     *
     * - we need a snapshot key factory that computes a snapshot for the ENTIRE
     *   result set and one for each item
     *
     *  - use localStorage for a quick implementation and then IndexDB once we have
     *    the general design working.
     *
     *  - audit the Firestore code to see which operations would use the key.
     *
     *      - I think they are just onSnapshot and doc().get()
     *
     */
    export function onSnapshot() {
        // noop for now
    }

    interface SnapshotPersistenceProvider {

        readonly purge: () => Promise<void>;

        /**
         * Return true if the cache contains teh given key.
         */
        readonly contains: (key: string) => Promise<boolean>;

        /**
         * Write to the cache.
         */
        readonly write: <V>(key: string, value: V) => Promise<void>;

        readonly read: <V>(key: string) => Promise<V | undefined>;

        /**
         * Remove an item from the cache.
         */
        readonly remove: (key: string) => Promise<void>;

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