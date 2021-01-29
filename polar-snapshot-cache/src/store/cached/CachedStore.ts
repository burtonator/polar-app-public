import {IStore} from "../IStore";
import {CacheProvider, TCacheDocTupleWithID} from "../../CacheProvider";
import {ICacheKeyCalculator} from "../../ICacheKeyCalculator";
import {ICollectionReference, IWhereClause, TWhereFilterOp, TWhereValue} from "../ICollectionReference";
import {IWriteBatch} from "../IWriteBatch";
import {IDocumentReference} from "../IDocumentReference";
import {IGetOptions} from "../IGetOptions";
import {TDocumentData} from "../TDocumentData";
import {IDocumentSnapshot} from "../IDocumentSnapshot";
import {IFirestoreError} from "../IFirestoreError";
import {ISnapshotListenOptions} from "../ISnapshotListenOptions";
import {IQuery, IQueryOrderBy, SnapshotUnsubscriber, TOrderByDirection} from "../IQuery";
import {IQuerySnapshot} from "../IQuerySnapshot";
import {CachedQueries} from "../../CachedQueries";
import {IDocumentChange} from "../IDocumentChange";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ICachedDoc} from "../../ICachedDoc";
import {Preconditions} from "polar-shared/src/Preconditions";

export namespace CachedStore {

    type GetHandler<V> = (options?: IGetOptions) => Promise<V>;

    function createGetHandler<V>(readFromCache: () => Promise<V | undefined>,
                                 writeToCache: (value: V) => Promise<void>,
                                 delegate: GetHandler<V>): GetHandler<V> {

        return async (options?: IGetOptions): Promise<V> => {

            const source = options?.source || 'default';

            async function handleSourceServer(): Promise<V> {

                const result = await delegate(options);
                await writeToCache(result);

                return result;

            }

            async function handleSourceCache(): Promise<V> {

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

            async function handleSourceDefault(): Promise<V> {

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

    }

    type SnapshotHandler<V> = (options: ISnapshotListenOptions,
                               onNext: (snapshot: V) => void,
                               onError?: (error: IFirestoreError) => void,
                               onCompletion?: () => void) => SnapshotUnsubscriber;

    function createSnapshotHandler<V>(readFromCache: () => Promise<V | undefined>,
                                      writeToCache: (value: V) => Promise<void>,
                                      delegate: SnapshotHandler<V>): SnapshotHandler<V> {

        return (options, onNext, onError, onCompletion): SnapshotUnsubscriber => {

            let hasServerSnapshot = false;

            function handleReadCachedSnapshot(snapshot: V | undefined) {

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

            function handleNext(snapshot: V) {

                hasServerSnapshot = true;

                writeToCache(snapshot)
                    .catch(handleCacheError);

                onNext(snapshot);

            }

            return delegate(options, handleNext, onError, onCompletion);

        }

    }

    export function create(delegate: IStore,
                           cacheProvider: CacheProvider,
                           cacheKeyCalculator: ICacheKeyCalculator): IStore {

        Preconditions.assertPresent(cacheKeyCalculator, 'create:cacheKeyCalculator');

        function collection(collectionName: string): ICollectionReference {

            const _collection = delegate.collection(collectionName);

            function doc(documentPath?: string): IDocumentReference {

                const _doc = _collection.doc(documentPath);

                async function readFromCache(): Promise<IDocumentSnapshot | undefined> {

                    const cacheKey = cacheKeyCalculator.computeForDoc(_doc.parent.id, _doc);

                    const cacheData = await cacheProvider.readDoc(cacheKey);

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

                    await cacheProvider.writeDoc(cacheKey, {
                        id: snapshot.id,
                        exists: snapshot.exists,
                        data: snapshot.data()
                    });

                }

                const getter = createGetHandler<IDocumentSnapshot>(readFromCache, writeToCache, (options) => _doc.get(options));
                const snapshotter = createSnapshotHandler<IDocumentSnapshot>(readFromCache,
                                                                             writeToCache,
                                                                             (options, onNext, onError, onCompletion) => _doc.onSnapshot(options, onNext, onError, onCompletion));

                async function get(options?: IGetOptions): Promise<IDocumentSnapshot> {
                    return getter(options);
                }

                async function set(data: TDocumentData) {

                    await writeToCache({
                        exists: true,
                        id: _doc.id,
                        metadata: {
                            hasPendingWrites: false,
                            fromCache: true,
                        },
                        data: () => data
                    });

                    return _doc.set(data);

                }

                async function _delete() {

                    await writeToCache({
                        exists: false,
                        id: _doc.id,
                        metadata: {
                            hasPendingWrites: false,
                            fromCache: true,
                        },
                        data: () => undefined
                    });

                }

                function onSnapshot(options: ISnapshotListenOptions,
                                    onNext: (snapshot: IDocumentSnapshot) => void,
                                    onError?: (error: IFirestoreError) => void,
                                    onCompletion?: () => void): SnapshotUnsubscriber {

                    return snapshotter(options, onNext, onError, onCompletion);

                }

                return {
                    parent: _doc.parent,
                    id: _doc.id,
                    get,
                    set,
                    delete: _delete,
                    onSnapshot
                }

            }

            class Query implements IQuery {

                private readonly getter: GetHandler<IQuerySnapshot>;
                private readonly snapshotter: SnapshotHandler<IQuerySnapshot>;

                private readonly _clauses: IWhereClause[] = [];

                private _limit: number | undefined = undefined;

                private _order: IQueryOrderBy[] = [];

                /**
                 *
                 * @param _query The underlying query delegate.
                 * @param _collection The collection we're querying
                 */
                constructor(private readonly _query: IQuery,
                            private readonly _collection: ICollectionReference) {

                    this.getter = createGetHandler<IQuerySnapshot>(() => this.readFromCache(),
                                                                   value => this.writeToCache(value),
                                                                   (options) => this._query.get(options));

                    this.snapshotter = createSnapshotHandler<IQuerySnapshot>(() => this.readFromCache(),
                                                                             value => this.writeToCache(value),
                                                                             (options, onNext, onError, onCompletion) => this._query.onSnapshot(options, onNext, onError, onCompletion));

                }

                private computeCacheKey(): string {
                    return cacheKeyCalculator.computeForQuery({
                        collection: this._collection.id,
                        clauses: this._clauses,
                        limit: this._limit,
                        order: this._order
                    });
                }

                private async readFromCache(): Promise<IQuerySnapshot | undefined> {

                    Preconditions.assertPresent(cacheKeyCalculator, 'Query.readFromCache:cacheKeyCalculator');

                    const cacheKey = this.computeCacheKey();

                    const cachedQuery = await cacheProvider.readQuery(cacheKey);

                    if (cachedQuery) {

                        const keys = cachedQuery.docs.map(current => current.id);
                        const docs = await cacheProvider.readDocs(keys);

                        const index = arrayStream(docs).toMap(current => current.id);

                        return CachedQueries.fromCache(cachedQuery, index);
                    }

                    return undefined;

                }

                private async writeToCache(snapshot: IQuerySnapshot) {

                    Preconditions.assertPresent(cacheKeyCalculator, 'Query.writeToCache:cacheKeyCalculator');

                    const cacheKey = this.computeCacheKey();

                    await cacheProvider.writeQuery(cacheKey, CachedQueries.toCache({
                        collection: this._collection.id,
                        clauses: [...this._clauses],
                        limit: this._limit,
                        order: [...this._order]
                    }, snapshot));

                    const docChanges = snapshot.docChanges();

                    function toCacheEntry(docChange: IDocumentChange): TCacheDocTupleWithID {

                        switch (docChange.type) {

                            case "added":
                            case "modified":
                                return [
                                    docChange.doc.id,
                                    {
                                        id: docChange.doc.id,
                                        exists: true,
                                        data: docChange.doc.data()
                                    }
                                ]
                            case "removed":
                                return [
                                    docChange.doc.id,
                                    {
                                        id: docChange.doc.id,
                                        exists: false,
                                        data: undefined
                                    }
                                ];

                        }

                    }

                    await cacheProvider.writeDocs(docChanges.map(toCacheEntry))

                }

                public where(fieldPath: string, opStr: TWhereFilterOp, value: TWhereValue): IQuery {
                    this._clauses.push({fieldPath, opStr, value});
                    this._query.where(fieldPath, opStr, value);
                    return this;
                }

                async get(options?: IGetOptions): Promise<IQuerySnapshot> {
                    return this.getter(options);
                }

                onSnapshot(options: ISnapshotListenOptions,
                           onNext: (snapshot: IQuerySnapshot) => void,
                           onError?: (error: IFirestoreError) => void,
                           onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter(options, onNext, onError, onCompletion);

                }

                public limit(count: number): IQuery {
                    this._limit = count;
                    return this;
                }

                public orderBy(fieldPath: string, directionStr?: TOrderByDirection): IQuery {
                    this._order.push({fieldPath, directionStr});
                    return this;
                }

            }


            function where(fieldPath: string, opStr: TWhereFilterOp, value: TWhereValue): IQuery {

                const _query = _collection.where(fieldPath, opStr, value);
                const query = new Query(_query, _collection);
                return query.where(fieldPath, opStr, value);
            }

            return {
                id: _collection.id,
                doc,
                where
            }

        }

        interface BatchDelete {
            /**
             * Document ID.
             */
            readonly id: string;

            readonly type: 'delete';

            readonly documentRef: IDocumentReference;
        }

        interface BatchSet {
            /**
             * Document ID.
             */
            readonly id: string;

            readonly type: 'set';
            readonly documentRef: IDocumentReference;
            readonly data: TDocumentData;
        }

        type BatchOp = BatchDelete | BatchSet;

        class Batch implements IWriteBatch {

            private _batch = delegate.batch();

            private ops: BatchOp[] = [];

            delete(documentRef: IDocumentReference): IWriteBatch {
                this.ops.push({id: documentRef.id, type: 'delete', documentRef});
                this._batch.delete(documentRef);
                return this;
            }

            set(documentRef: IDocumentReference, data: TDocumentData): IWriteBatch {
                this.ops.push({id: documentRef.id, type: 'set', documentRef, data});
                this._batch.set(documentRef, data);
                return this;
            }

            async commit(): Promise<void> {

                const handleCacheMutation = async () => {

                    function toDoc(op: BatchOp): ICachedDoc {

                        switch (op.type) {

                            case "delete":

                                return {
                                    id: op.id,
                                    exists: false,
                                    data: undefined
                                };

                            case "set":

                                return {
                                    id: op.id,
                                    exists: true,
                                    data: op.data
                                }

                        }

                    }

                    function toCacheDocTuple(op: BatchOp): TCacheDocTupleWithID {
                        const cacheKey = cacheKeyCalculator.computeForDoc(op.documentRef.parent.id, op.documentRef);
                        const doc = toDoc(op);
                        return [cacheKey, doc];
                    }

                    await cacheProvider.writeDocs(this.ops.map(toCacheDocTuple))

                }

                // TODO: don't await this... do it in the background so that the
                // cache latency isn't felt by the caller.
                await handleCacheMutation();

                await this._batch.commit();

            }

        }

        function batch(): IWriteBatch {
            return new Batch();
        }

        async function terminate() {
            await delegate.terminate();
        }

        async function clearPersistence() {
            await delegate.clearPersistence();
        }

        return {collection, batch, terminate, clearPersistence};

    }

}
