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

    export type SnapshotBacking = 'none' | 'localStorage' | 'IndexedDB';

    export interface SnapshotCacheConfig {
        readonly backing: SnapshotBacking;
    }

    let config: SnapshotCacheConfig = {
        backing: 'IndexedDB'
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

            switch (config.backing) {

                case "none":
                    return delegate;

                case "localStorage":
                    return CachedStore.create(delegate, CacheProviders.create(config.backing), cacheKeyCalculator!);

                case "IndexedDB":
                    return CachedStore.create(delegate, CacheProviders.create(config.backing), cacheKeyCalculator!);

            }

        }

        return {
            withGenericSnapshotCacheKey,
            build
        }

    }

}