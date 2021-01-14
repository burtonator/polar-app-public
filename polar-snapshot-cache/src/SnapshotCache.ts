import {SnapshotCacheProviders} from "./SnapshotCacheProviders";
import {SnapshotCacheProvider} from "./SnapshotCacheProvider";
import {ICollectionReference} from "./store/ICollectionReference";

/**
 * The general design here is that we have a snapshot interface that mimics
 * Firestore and the main and high level usage pattern.
 *
 *
 */
export namespace SnapshotCache {

    export type SnapshotBacking = 'none' | 'localStorage';

    export interface SnapshotCacheConfig {
        readonly backing: SnapshotBacking;
    }

    let config: SnapshotCacheConfig = {
        backing: 'none'
    };

    let cacheProvider: SnapshotCacheProvider = SnapshotCacheProviders.create('none');

    /**
     * Purge all data in the snapshot cache using the current configuration
     */
    export async function purge() {
        // noop for now
    }

    /**
     * Configure how the snapshot cache works, whether it's enabled, etc.
     */
    export function configure(newConfig: SnapshotCacheConfig) {
        config = newConfig;
        cacheProvider = SnapshotCacheProviders.create(config.backing);
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

    /**
     * Generic collection factory which can be used for the REAL underlying
     * storage layer (Firestore) or a mock one for our testing.
     */
    export type CollectionFactory = (collectionPath: string) => ICollectionReference;

}