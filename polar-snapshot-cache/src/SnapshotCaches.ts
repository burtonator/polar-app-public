import {SnapshotCacheProviders} from "./SnapshotCacheProviders";
import {SnapshotCacheProvider} from "./SnapshotCacheProvider";
import {IStore} from "./store/IStore";
import {ICacheKeyCalculator} from "./ICacheKeyCalculator";
import {DatastoreCollection} from "../../../polar-bookshelf/web/js/datastore/FirebaseDatastore";
import { CacheKeyCalculators } from "./CacheKeyCalculators";

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

    export interface IStoreBuilder {
        readonly withGenericSnapshotCacheKey: (collectionName: string, snapshotCacheKey: string) => IStoreBuilder;
        readonly build: (delegate: IStore) => Promise<IStore>;
    }

    export function create(): IStoreBuilder {

        let cacheKeyCalculator: ICacheKeyCalculator | undefined;

        function withGenericSnapshotCacheKey(collectionName: string, snapshotCacheKey: string) {
            cacheKeyCalculator = CacheKeyCalculators.createGeneric(DatastoreCollection.DOC_META, snapshotCacheKey)
            return this;
        }

        async function build(delegate: IStore) {

            switch (config.type) {

                case "direct":
                    return delegate;

            }

        }

        return {
            withGenericSnapshotCacheKey,
            build
        }

    }

}