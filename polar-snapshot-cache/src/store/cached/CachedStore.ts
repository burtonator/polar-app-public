import {IStore} from "../IStore";
import {SnapshotCacheProvider} from "../../SnapshotCacheProvider";
import {ICacheKeyCalculator} from "../../ICacheKeyCalculator";
import {ICollectionReference, TWhereFilterOp} from "../ICollectionReference";
import {IWriteBatch} from "../IWriteBatch";
import {IDocumentReference} from "../IDocumentReference";
import {IGetOptions} from "../IGetOptions";
import {TDocumentData} from "../TDocumentData";
import {IDocumentSnapshot} from "../IDocumentSnapshot";
import {ISnapshotCachedDoc} from "../../ISnapshotCachedDoc";
import {IFirestoreError} from "../IFirestoreError";
import {ISnapshotListenOptions} from "../ISnapshotListenOptions";
import {IQuery, SnapshotUnsubscriber} from "../IQuery";
import {IQuerySnapshot} from "../IQuerySnapshot";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export namespace CachedStore {

    export function create(delegate: IStore,
                           snapshotCacheProvider: SnapshotCacheProvider,
                           cacheKeyCalculator: ICacheKeyCalculator): IStore {

        function collection(collectionName: string): ICollectionReference {

            const _collection = delegate.collection(collectionName);

            function doc(documentPath?: string): IDocumentReference {

                const _doc = _collection.doc(documentPath);

                async function readFromCache(): Promise<IDocumentSnapshot | undefined> {

                    const cacheKey = cacheKeyCalculator.computeForDoc(_doc.parent.id, _doc);

                    const cacheData: ISnapshotCachedDoc | undefined = await snapshotCacheProvider.readDoc(cacheKey);

                    if (cacheData) {
                        return {
                            id: _doc.id,
                            metadata: {
                                hasPendingWrites: false,
                                fromCache: true
                            },
                            exists: cacheData.exists,
                            data: () => cacheData.data
                        }
                    }

                    return undefined;

                }

                async function writeToCache(snapshot: IDocumentSnapshot) {
                    const cacheKey = cacheKeyCalculator.computeForDoc(_doc.parent.id, _doc);

                    await snapshotCacheProvider.writeDoc(cacheKey, {
                        exists: snapshot.exists,
                        data: snapshot.data()
                    });

                }

                async function get(options?: IGetOptions): Promise<IDocumentSnapshot> {

                    const source = options?.source || 'default';

                    async function handleSourceServer(): Promise<IDocumentSnapshot> {

                        const result = await _doc.get(options);
                        await writeToCache(result);

                        return result;

                    }

                    async function handleSourceCache(): Promise<IDocumentSnapshot> {

                        const snapshot = await readFromCache();

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

                function onSnapshot(options: ISnapshotListenOptions,
                                    onNext: (snapshot: IDocumentSnapshot) => void,
                                    onError?: (error: IFirestoreError) => void,
                                    onCompletion?: () => void): SnapshotUnsubscriber {

                    let hasServerSnapshot = false;

                    function handleReadCachedSnapshot(snapshot: IDocumentSnapshot | undefined) {

                        if (hasServerSnapshot) {
                            // we might receive the server snapshot first so
                            // have to be careful there.
                            return;
                        }

                        if (snapshot) {
                            onNext(snapshot);
                        }

                    }

                    function handleCacheError(err: Error) {

                        if (onError) {

                            onError({
                                code: 'internal',
                                message: err.message,
                                name: err.name,
                                stack: err.stack
                            })

                        }
                    }

                    readFromCache()
                        .then(snapshot => handleReadCachedSnapshot(snapshot))
                        .catch(handleCacheError)

                    function handleNext(snapshot: IDocumentSnapshot) {

                        hasServerSnapshot = true;

                        writeToCache(snapshot)
                            .catch(handleCacheError);

                        onNext(snapshot);

                    }

                    return _doc.onSnapshot(options, handleNext, onError, onCompletion);

                }

                return {
                    parent: _doc.parent,
                    id: _doc.id,
                    get,
                    onSnapshot
                }

            }

            class Query implements IQuery {

                constructor(private readonly _query: IQuery) {
                }

                where(fieldPath: string, opStr: TWhereFilterOp, value: any): IQuery {
                    this._query.where(fieldPath, opStr, value);
                    return this;
                }

                async get(options?: IGetOptions): Promise<IQuerySnapshot> {

                    // FIXME: we need new cache primitives or queries

                    // FIXME
                    return null!;


                }

                onSnapshot(options: ISnapshotListenOptions, onNext: (snapshot: IQuerySnapshot) => void, onError?: (error: IFirestoreError) => void, onCompletion?: () => void): SnapshotUnsubscriber {
                    // FIXME: we need new cache primitives or queries
                    // FIXME
                    return NULL_FUNCTION;
                }

            }


            function where(fieldPath: string, opStr: TWhereFilterOp, value: any): IQuery {

                // FIXME: we can use the where clause and the collection to
                // build a cache key so it doesn't need to be specified which
                // would then make firestore a more general cache for us.

                const _query = _collection.where(fieldPath, opStr, value);
                const query = new Query(_query);
                return query.where(fieldPath, opStr, value);
            }

            return {
                id: _collection.id,
                doc,
                where
            }

        }

        interface BatchDelete {
            readonly type: 'delete';
            readonly documentRef: IDocumentReference;
        }

        interface BatchSet {
            readonly type: 'set';
            readonly documentRef: IDocumentReference;
            readonly data: TDocumentData;
        }

        type BatchOp = BatchDelete | BatchSet;

        class Batch implements IWriteBatch {

            private _batch = delegate.batch();

            private ops: BatchOp[] = [];

            delete(documentRef: IDocumentReference): IWriteBatch {
                this.ops.push({type: 'delete', documentRef});
                this._batch.delete(documentRef);
                return this;
            }

            set(documentRef: IDocumentReference, data: TDocumentData): IWriteBatch {
                this.ops.push({type: 'set', documentRef, data});
                this._batch.set(documentRef, data);
                return this;
            }

            async commit(): Promise<void> {

                const handleCacheMutation = async () => {

                    // TODO: when we migrate to idb do this as a transaction.

                    // apply the operations in the order called by the user
                    for (const op of this.ops) {

                        switch (op.type) {

                            // FIXME: this has to be implemented...

                            case "delete":
                                break;
                            case "set":
                                break;

                        }

                    }

                }

                await handleCacheMutation();

                await this._batch.commit();

            }

        }

        function batch(): IWriteBatch {
            return new Batch();
        }

        return {collection, batch};

    }

}