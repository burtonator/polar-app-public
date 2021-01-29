import {CacheProviders} from "./CacheProviders";
import {CacheProvider} from "./CacheProvider";
import {IStore} from "./store/IStore";
import {ICacheKeyCalculator} from "./ICacheKeyCalculator";
import { CacheKeyCalculators } from "./CacheKeyCalculators";
import {Preconditions} from "polar-shared/src/Preconditions";
import {CachedStore} from "./store/cached/CachedStore";

/**
 * The general design here is that we have a snapshot interface that mimics
 * Firestore and the main and high level usage pattern.
 *
 */
export namespace StoreCaches {

    export type SnapshotBacking = 'none' | 'IndexedDB';

    export interface SnapshotCacheConfig {
        readonly backing: SnapshotBacking;
    }

    let config: SnapshotCacheConfig = {
        // backing: 'IndexedDB'
        backing: 'none'
    };

    console.log("Using StoreCache: " + config.backing);

    let cacheProvider: CacheProvider = CacheProviders.create(config.backing);

    /**
     * Purge all data in the snapshot cache using the current configuration
     */
    export async function purge() {
        await cacheProvider.purge();
    }

    /**
     * Configure how the snapshot cache works, whether it's enabled, etc.
     */
    export function configure(newConfig: SnapshotCacheConfig) {
        config = newConfig;
        cacheProvider = CacheProviders.create(config.backing);
    }

    export interface IStoreBuilder {
        readonly build: (delegate: IStore) => Promise<IStore>;
    }

    export function create(): IStoreBuilder {

        let cacheKeyCalculator: ICacheKeyCalculator | undefined;

        async function build(delegate: IStore) {

            Preconditions.assertPresent(delegate, 'delegate');

            cacheKeyCalculator = CacheKeyCalculators.createGeneric();

            switch (config.backing) {

                case "none":
                    return delegate;

                case "IndexedDB":
                    return CachedStore.create(delegate, CacheProviders.create(config.backing), cacheKeyCalculator!);

            }

        }

        return {
            build
        }

    }

}
