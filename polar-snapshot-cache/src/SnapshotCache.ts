export namespace SnapshotCache {

    export interface IGetOptions {
        readonly source?: 'default' | 'server' | 'cache';
    }

    export interface IDocumentSnapshot<V> {

        /**
         * Property of the `DocumentSnapshot` that signals whether or not the data
         * exists. True if the document exists.
         */
        readonly exists: boolean;

        /**
         * Property of the `DocumentSnapshot` that provides the document's ID.
         */
        readonly id: string;


        /**
         */
        data(): V | undefined;

    }

    export interface ICollectionReference {

    }

    export type SnapshotBacking = 'none' | 'localStorage';

    export interface Config {
        readonly backing: SnapshotBacking;
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


}