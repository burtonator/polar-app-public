import {SnapshotCacheProviders} from "./SnapshotCacheProviders";
import {SnapshotCacheProvider} from "./SnapshotCacheProvider";
import {ICollectionReference} from "./store/ICollectionReference";
import {IStore} from "./store/IStore";

/**
 * The general design here is that we have a snapshot interface that mimics
 * Firestore and the main and high level usage pattern.
 *
 *
 */
export namespace SnapshotCaches {

    export type StoreType = 'direct';

    export type SnapshotBacking = 'none' | 'localStorage';

    export interface SnapshotCacheConfig {
        readonly type: StoreType;
        readonly backing: SnapshotBacking;
    }

    let config: SnapshotCacheConfig = {
        type: 'direct',
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

    export async function create(delegate: IStore): Promise<IStore> {

        switch (config.type) {

            case "direct":
                return delegate;

        }

    }

}