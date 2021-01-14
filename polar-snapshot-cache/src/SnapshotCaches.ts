import {CacheProviders} from "./CacheProviders";
import {CacheProvider} from "./CacheProvider";
import {IStore} from "./store/IStore";
import {ICacheKeyCalculator} from "./ICacheKeyCalculator";
import { CacheKeyCalculators } from "./CacheKeyCalculators";
import {Preconditions} from "polar-shared/src/Preconditions";

/**
 * The general design here is that we have a snapshot interface that mimics
 * Firestore and the main and high level usage pattern.
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

    let cacheProvider: CacheProvider = CacheProviders.create('none');

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
        cacheProvider = CacheProviders.create(config.backing);
    }

    export interface IStoreBuilder {
        readonly withGenericSnapshotCacheKey: (snapshotCacheKey: string) => IStoreBuilder;
        readonly build: (delegate: IStore) => Promise<IStore>;
    }

    export function create(): IStoreBuilder {

        let cacheKeyCalculator: ICacheKeyCalculator | undefined;

        function withGenericSnapshotCacheKey(snapshotCacheKey: string) {
            cacheKeyCalculator = CacheKeyCalculators.createGeneric(snapshotCacheKey)
            return this;
        }

        async function build(delegate: IStore) {

            Preconditions.assertPresent(delegate, 'delegate');

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