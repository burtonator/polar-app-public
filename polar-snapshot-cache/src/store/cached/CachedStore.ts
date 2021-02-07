import {CacheProvider, TCacheDocTupleWithID} from "../../CacheProvider";
import {ICacheKeyCalculator} from "../../ICacheKeyCalculator";
import {ICollectionReference, IWhereClause, TWhereFilterOp, TWhereValue} from "../ICollectionReference";
import {IWriteBatch} from "../IWriteBatch";
import {IDocumentReference, IDocumentSnapshotObserver, isDocumentSnapshotObserver} from "../IDocumentReference";
import {IGetOptions} from "../IGetOptions";
import {TDocumentData} from "../TDocumentData";
import {IDocumentSnapshot} from "../IDocumentSnapshot";
import {IFirestoreError} from "../IFirestoreError";
import {ISnapshotListenOptions} from "../ISnapshotListenOptions";
import {
    IQuery,
    IQueryOrderBy,
    IQuerySnapshotObserver,
    isQuerySnapshotObserver,
    SnapshotUnsubscriber,
    TOrderByDirection
} from "../IQuery";
import {IQuerySnapshot} from "../IQuerySnapshot";
import {CachedQueries} from "../../CachedQueries";
import {IDocumentChange} from "../IDocumentChange";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ICachedDoc} from "../../ICachedDoc";
import {Preconditions} from "polar-shared/src/Preconditions";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { IFirestore } from "../IFirestore";

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

    export function create(delegate: IFirestore,
                           cacheProvider: CacheProvider,
                           cacheKeyCalculator: ICacheKeyCalculator): IFirestore {

        Preconditions.assertPresent(cacheKeyCalculator, 'cacheKeyCalculator');

        function collection(collectionName: string): ICollectionReference {

            const _collection = delegate.collection(collectionName);

            class DocumentReference implements IDocumentReference {
                private getter: GetHandler<IDocumentSnapshot>;
                private snapshotter: SnapshotHandler<IDocumentSnapshot>;

                constructor(public readonly id: string,
                            public readonly parent: ICollectionReference,
                            private readonly doc: IDocumentReference) {

                    this.getter = createGetHandler<IDocumentSnapshot>(() => this.readFromCache(),
                                                                      value => this.writeToCache(value),
                                                                      (options) => this.doc.get(options));

                    this.snapshotter = createSnapshotHandler<IDocumentSnapshot>(() => this.readFromCache(),
                                                                                value => this.writeToCache(value),
                                                                                (options, onNext, onError, onCompletion) => this.doc.onSnapshot(options, onNext, onError, onCompletion));


                }

                private async readFromCache(): Promise<IDocumentSnapshot | undefined> {

                    const cacheKey = cacheKeyCalculator.computeForDoc(this.doc.parent.id, this.doc);

                    const cacheData = await cacheProvider.readDoc({
                        key: cacheKey,
                        collection: this.doc.parent.id
                    });

                    if (cacheData) {
                        return {
                            id: this.doc.id,
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

                private async writeToCache(snapshot: IDocumentSnapshot) {

                    const cacheKey = cacheKeyCalculator.computeForDoc(this.doc.parent.id, this.doc);

                    await cacheProvider.writeDoc({
                        key: cacheKey,
                        doc: {
                            collection: _collection.id,
                            id: snapshot.id,
                            exists: snapshot.exists,
                            data: snapshot.data()
                        }
                    });

                }

                public async delete(): Promise<void> {

                    this.writeToCache({
                        exists: false,
                        id: this.doc.id,
                        metadata: {
                            hasPendingWrites: false,
                            fromCache: true,
                        },
                        data: () => undefined
                    }).catch(err => console.error("Unable to update cache: ", err));

                }

                public get(options?: IGetOptions): Promise<IDocumentSnapshot> {
                    return this.getter(options);
                }

                public async set(data: TDocumentData): Promise<void> {

                    this.writeToCache({
                        exists: true,
                        id: this.doc.id,
                        metadata: {
                            hasPendingWrites: false,
                            fromCache: true,
                        },
                        data: () => data
                    }).catch(err => console.error("Unable to update cache: ", err));

                    return this.doc.set(data);

                }

                private onSnapshotWithObserver(observer: IDocumentSnapshotObserver): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter({}, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithOptionsAndObserver(options: ISnapshotListenOptions,
                                                         observer: IDocumentSnapshotObserver): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter(options, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithCallbacks(onNext: (snapshot: IDocumentSnapshot) => void,
                                                onError?: (error: IFirestoreError) => void,
                                                onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter({}, onNext, onError, onCompletion);

                }

                private onSnapshotWithOptionsAndCallbacks(options: ISnapshotListenOptions,
                                                          onNext: (snapshot: IDocumentSnapshot) => void,
                                                          onError?: (error: IFirestoreError) => void,
                                                          onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter(options, onNext, onError, onCompletion);

                }

                public onSnapshot(observer: IDocumentSnapshotObserver): SnapshotUnsubscriber;
                public onSnapshot(options: ISnapshotListenOptions, observer: IDocumentSnapshotObserver): SnapshotUnsubscriber;
                public onSnapshot(onNext: (snapshot: IDocumentSnapshot) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): SnapshotUnsubscriber;
                public onSnapshot(options: ISnapshotListenOptions,
                                  onNext: (snapshot: IDocumentSnapshot) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): SnapshotUnsubscriber;

                public onSnapshot(arg0: IDocumentSnapshotObserver | ISnapshotListenOptions | ((snapshot: IDocumentSnapshot) => void),
                                  arg1?: IDocumentSnapshotObserver | ((error: IFirestoreError) => void) | ((snapshot: IDocumentSnapshot) => void),
                                  arg2?: (() => void) | ((error: IFirestoreError) => void),
                                  arg3?: () => void): SnapshotUnsubscriber | (() => void) {

                    if (isDocumentSnapshotObserver(arg0) && arg1 === undefined && arg2 === undefined && arg3 === undefined) {
                        return this.onSnapshotWithObserver(arg0);
                    }

                    if (typeof arg0 === 'object' && isDocumentSnapshotObserver(arg1)) {
                        return this.onSnapshotWithOptionsAndObserver(arg0 as ISnapshotListenOptions, arg1);
                    }

                    if (typeof arg0 === 'function' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' )) {
                        return this.onSnapshotWithCallbacks(arg0, arg1 as any, arg2 as any);
                    }

                    if (typeof arg0 === 'object' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' ) &&
                        (typeof arg3 === 'function' || typeof arg3 === 'undefined' )) {

                        return this.onSnapshotWithOptionsAndCallbacks(arg0 as ISnapshotListenOptions, arg1 as any, arg2 as any, arg3 as any);

                    }

                    throw new Error("Invalid arguments");

                }

            }

            function doc(documentPath?: string): IDocumentReference {

                const _doc = _collection.doc(documentPath);
                return new DocumentReference(_doc.id, _collection, _doc, )

            }

            class Query implements IQuery {

                private readonly getter: GetHandler<IQuerySnapshot>;
                private readonly snapshotter: SnapshotHandler<IQuerySnapshot>;

                private readonly _clauses: IWhereClause[] = [];

                private _startAfter: string | undefined = undefined;

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

                    Preconditions.assertPresent(cacheKeyCalculator, 'cacheKeyCalculator');

                    const cacheKey = this.computeCacheKey();

                    const cachedQuery = await cacheProvider.readQuery({
                        key: cacheKey,
                        collection: this._collection.id
                    });

                    if (cachedQuery) {

                        const keys = cachedQuery.docs.map(current => current.id);
                        const docs = await cacheProvider.readDocs({keys, collection: this._collection.id});

                        const index = arrayStream(docs).toMap(current => current.id);

                        return CachedQueries.fromCache(cachedQuery, index);
                    }

                    return undefined;

                }

                private async writeToCache(snapshot: IQuerySnapshot) {

                    Preconditions.assertPresent(cacheKeyCalculator, 'cacheKeyCalculator');

                    const cacheKey = this.computeCacheKey();

                    await cacheProvider.writeQuery({
                        key: cacheKey,
                        query: CachedQueries.toCache({
                                   collection: this._collection.id,
                                   clauses: [...this._clauses],
                                   limit: this._limit,
                                   order: [...this._order]
                        }, snapshot)
                    });

                    const docChanges = snapshot.docChanges();

                    function toCacheEntry(docChange: IDocumentChange): TCacheDocTupleWithID {

                        switch (docChange.type) {

                            case "added":
                            case "modified":
                                return [
                                    docChange.doc.id,
                                    {
                                        collection: _collection.id,
                                        id: docChange.doc.id,
                                        exists: true,
                                        data: docChange.doc.data()
                                    }
                                ]
                            case "removed":
                                return [
                                    docChange.doc.id,
                                    {
                                        collection: _collection.id,
                                        id: docChange.doc.id,
                                        exists: false,
                                        data: undefined
                                    }
                                ];

                        }

                    }

                    await cacheProvider.writeDocs({
                        docs: docChanges.map(toCacheEntry)
                    });

                }

                public where(fieldPath: string, opStr: TWhereFilterOp, value: TWhereValue): IQuery {
                    this._clauses.push({fieldPath, opStr, value});
                    this._query.where(fieldPath, opStr, value);
                    return this;
                }

                async get(options?: IGetOptions): Promise<IQuerySnapshot> {
                    return this.getter(options);
                }

                private onSnapshotWithObserver(observer: IQuerySnapshotObserver): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter({}, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithOptionsAndObserver(options: ISnapshotListenOptions,
                                                         observer: IQuerySnapshotObserver): SnapshotUnsubscriber {
                    const onNext = observer.next || NULL_FUNCTION;
                    return this.snapshotter(options, onNext, observer.error, observer.complete);
                }

                private onSnapshotWithCallbacks(onNext: (snapshot: IQuerySnapshot) => void,
                                                onError?: (error: IFirestoreError) => void,
                                                onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter({}, onNext, onError, onCompletion);

                }

                private onSnapshotWithOptionsAndCallbacks(options: ISnapshotListenOptions,
                                                          onNext: (snapshot: IQuerySnapshot) => void,
                                                          onError?: (error: IFirestoreError) => void,
                                                          onCompletion?: () => void): SnapshotUnsubscriber {

                    return this.snapshotter(options, onNext, onError, onCompletion);

                }

                public onSnapshot(observer: IQuerySnapshotObserver): SnapshotUnsubscriber;

                public onSnapshot(options: ISnapshotListenOptions,
                                  observer: IQuerySnapshotObserver): SnapshotUnsubscriber;

                public onSnapshot(onNext: (snapshot: IQuerySnapshot) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): () => void;

                public onSnapshot(options: ISnapshotListenOptions,
                                  onNext: (snapshot: IQuerySnapshot) => void,
                                  onError?: (error: IFirestoreError) => void,
                                  onCompletion?: () => void): SnapshotUnsubscriber;

                public onSnapshot(arg0: IQuerySnapshotObserver | ISnapshotListenOptions | ((snapshot: IQuerySnapshot) => void),
                                  arg1?: IQuerySnapshotObserver | ((error: IFirestoreError) => void) | ((snapshot: IQuerySnapshot) => void),
                                  arg2?: (() => void) | ((error: IFirestoreError) => void),
                                  arg3?: () => void): SnapshotUnsubscriber | (() => void) {

                    if (isQuerySnapshotObserver(arg0) && arg1 === undefined && arg2 === undefined && arg3 === undefined) {
                        return this.onSnapshotWithObserver(arg0);
                    }

                    if (typeof arg0 === 'object' && isQuerySnapshotObserver(arg1)) {
                        return this.onSnapshotWithOptionsAndObserver(arg0 as ISnapshotListenOptions, arg1);
                    }

                    if (typeof arg0 === 'function' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' )) {
                        return this.onSnapshotWithCallbacks(arg0, arg1 as any, arg2 as any);
                    }

                    if (typeof arg0 === 'object' &&
                        (typeof arg1 === 'function' || typeof arg1 === 'undefined' ) &&
                        (typeof arg2 === 'function' || typeof arg2 === 'undefined' ) &&
                        (typeof arg3 === 'function' || typeof arg3 === 'undefined' )) {

                        return this.onSnapshotWithOptionsAndCallbacks(arg0 as ISnapshotListenOptions, arg1 as any, arg2 as any, arg3 as any);

                    }

                    throw new Error("Invalid arguments");

                }

                public limit(count: number): IQuery {
                    this._limit = count;
                    return this;
                }

                public orderBy(fieldPath: string, directionStr?: TOrderByDirection): IQuery {
                    this._order.push({fieldPath, directionStr});
                    return this;
                }

                public startAfter(startAfter: string | undefined): IQuery {
                    this._startAfter = startAfter;
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
                                    collection: op.documentRef.parent.id,
                                    id: op.id,
                                    exists: false,
                                    data: undefined
                                };

                            case "set":

                                return {
                                    collection: op.documentRef.parent.id,
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

                    cacheProvider.writeDocs({
                        docs: this.ops.map(toCacheDocTuple)
                    }).catch(err => console.error("Unable to update cache: ", err));

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
