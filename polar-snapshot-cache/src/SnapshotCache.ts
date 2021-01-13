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

        return {purge, contains, write, remove};

    }

}