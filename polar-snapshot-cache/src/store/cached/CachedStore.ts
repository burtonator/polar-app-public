import {IStore} from "../IStore";
import {SnapshotCacheProvider} from "../../SnapshotCacheProvider";
import {ICacheKeyCalculator} from "../../ICacheKeyCalculator";
import {ICollectionReference} from "../ICollectionReference";
import {IWriteBatch} from "../IWriteBatch";
import {IDocumentReference} from "../IDocumentReference";
import {IGetOptions} from "../IGetOptions";
import {TDocumentData} from "../TDocumentData";
import {IDocumentSnapshot} from "../IDocumentSnapshot";
import {ISnapshotCacheEntry} from "../../ISnapshotCacheEntry";
import {IFirestoreError} from "../IFirestoreError";

export namespace CachedStore {

    export function create(delegate: IStore,
                           snapshotCacheProvider: SnapshotCacheProvider,
                           cacheKeyCalculator: ICacheKeyCalculator): IStore {

        function collection(collectionName: string): ICollectionReference {

            const _collection = delegate.collection(collectionName);

            function doc(documentPath?: string): IDocumentReference {

                const _doc = _collection.doc(documentPath);

                async function get(options?: IGetOptions): Promise<IDocumentSnapshot> {

                    const source = options?.source || 'default';

                    async function getFromCache(): Promise<IDocumentSnapshot | undefined> {

                        const cacheKey = cacheKeyCalculator.computeForDoc(_doc.parent.id, _doc);

                        const cacheData: ISnapshotCacheEntry<TDocumentData> | undefined = await snapshotCacheProvider.read(cacheKey);

                        if (cacheData) {
                            return {
                                id: _doc.id,
                                metadata: {
                                    hasPendingWrites: false,
                                    fromCache: true
                                },
                                exists: cacheData.exists,
                                data: () => cacheData.value
                            }
                        }

                        return undefined;

                    }

                    async function writeToCache(snapshot: IDocumentSnapshot) {
                        const cacheKey = cacheKeyCalculator.computeForDoc(_doc.parent.id, _doc);

                        await snapshotCacheProvider.write(cacheKey, {
                            exists: snapshot.exists,
                            value: snapshot.data()
                        });

                    }

                    async function handleSourceServer(): Promise<IDocumentSnapshot> {

                        const result = await _doc.get(options);
                        await writeToCache(result);

                        return result;

                    }

                    async function handleSourceCache(): Promise<IDocumentSnapshot> {

                        const snapshot = await getFromCache();

                        if (snapshot) {
                            return snapshot;
                        }

                        const err = new Error();

                        const error: IFirestoreError = {
                            code: 'not-found',
                            message: "Document not found in cache",
                            name: err.name,
                            stack: err.stack
                        }

                        throw error;

                    }

                    async function handleSourceDefault(): Promise<IDocumentSnapshot> {

                        try {
                            return await handleSourceServer();
                        } catch (e) {
                            return await handleSourceCache();
                        }

                    }


                    switch (source) {

                        case "default":
                            return await handleSourceDefault();
                        case "server":
                            return await handleSourceServer();
                        case "cache":
                            return await handleSourceCache();

                    }

                }

                // return {
                //     parent: _doc.parent,
                //     id: _doc.id,
                //     get
                // }

                return null!;

            }

            // return {
            //     id: _collection.id,
            // }

            return null!;

        }

        function batch(): IWriteBatch {

            return null!;
        }

        return {collection, batch};

    }

}