import {Preconditions} from "polar-shared/src/Preconditions";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Arrays} from "polar-shared/src/util/Arrays";

/**
 * Generic functions for working with Firebase collections
 */
export class Collections {

    /**
     *
     * @param firestore  The firestore instance
     * @param name The name of of the collection.
     */
    public constructor(private readonly firestore: FirestoreLike,
                       private readonly name: CollectionNameStr) {

    }

    public async getOrCreate<T>(batch: WriteBatchLike,
                                documentReference: DocumentReferenceLike,
                                createRecord: () => T): Promise<GetOrCreateRecord<T>> {

        const doc = await documentReference.get();

        if (doc.exists) {

            return {
                created: false,
                record: <T> doc.data()
            };

        }

        const createdRecord = createRecord();

        const record = Dictionaries.onlyDefinedProperties(createdRecord);
        batch.create(documentReference, record);

        return {
            created: true,
            record
        };

    }

    public async set<T>(id: string, value: T) {
        value = Dictionaries.onlyDefinedProperties(value);
        const ref = this.firestore.collection(this.name).doc(id);
        await ref.set(value);
    }

    public async get<T>(id: string): Promise<T | undefined> {
        const ref = this.firestore.collection(this.name).doc(id);
        const doc = await ref.get();
        return <T> doc.data();
    }

    public async getByID<T>(id: string): Promise<T | undefined> {
        return this.get(id);
    }

    public async getByFieldValue<T>(field: string, value: ValueType): Promise<T | undefined> {
        const results = await this.list<T>([[field, '==', value]]);
        return this.first([field], results);
    }

    public async getByFieldValues<T>(clauses: ReadonlyArray<Clause>): Promise<T | undefined> {
        const results = await this.list<T>(clauses);

        const fields = clauses.map(current => current[0]);

        return this.first(fields, results);
    }

    private first<T>(fields: ReadonlyArray<string>,
                     results: ReadonlyArray<T>): T | undefined {

        if (results.length === 0) {
            return undefined;
        } else if (results.length === 1) {
            return results[0];
        } else {
            throw new Error(`Too many records on collection ${this.name} for fields ${fields} ` + results.length);
        }

    }

    public async listByFieldValue<T>(field: string, value: ValueType): Promise<ReadonlyArray<T>> {
        return this.list([[field, '==', value]]);
    }

    private createQuery(clauses: ReadonlyArray<Clause>, opts: ListOpts = {}) {

        // TODO: should work without any clauses and just list all the records
        // which is fine for small collections

        const clause = clauses[0];
        const [field, op, value] = clause;

        Clauses.assertPresent(clause);

        let query = this.firestore
            .collection(this.name)
            .where(field, op, value);

        for (const clause of clauses.slice(1)) {
            const [field, op, value] = clause;
            Clauses.assertPresent(clause);
            query = query.where(field, op, value);
        }

        for (const orderBy of opts.orderBy || []) {
            query = query.orderBy(orderBy[0], orderBy[1]);
        }

        if (opts.startAfter) {
            query = query.startAfter(...opts.startAfter);
        }

        if (opts.startAt) {
            query = query.startAt(...opts.startAt);
        }

        if (opts.limit !== undefined) {
            query = query.limit(opts.limit);
        }

        if (opts.offset !== undefined) {
            query = query.offset(opts.offset);
        }

        return query;

    }

    private snapshotToRecords<T>(snapshot: QuerySnapshotLike) {
        return snapshot.docs.map(current => <T> current.data());
    }

    public collection() {
        return this.firestore.collection(this.name);
    }

    public async list<T>(clauses: ReadonlyArray<Clause>,
                         opts: ListOpts = {}): Promise<ReadonlyArray<T>> {

        const query = this.createQuery(clauses, opts);

        const snapshot = await query.get();

        return this.snapshotToRecords(snapshot);

    }

    public async iterate<T>(clauses: ReadonlyArray<Clause>,
                            opts: IterateOpts = {}): Promise<Cursor<T>> {

        const limit = opts.limit || 100;

        let startAfter: any[] | undefined;

        // we always have at least one page...
        let hasNext: boolean = true;

        const next = async (): Promise<ReadonlyArray<T>> => {

            const query = this.createQuery(clauses, {...opts, startAfter});
            const snapshot = await query.get();

            hasNext = snapshot.docs.length === limit;

            if (hasNext) {

                const last = Arrays.last(snapshot.docs)!;

                const computeStartAfter = () => {

                    const result: any[] = [];

                    for (const orderByClause of opts.orderBy || []) {
                        result.push(last.get(orderByClause[0]));
                    }

                    return result;

                };

                startAfter = computeStartAfter();

            }

            return this.snapshotToRecords(snapshot);

        };

        return {
            next,
            hasNext(): boolean {
                return hasNext;
            }
        };

    }

    public async deleteByID(batch: WriteBatchLike,
                            provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const records = await provider();

        for (const record of records) {

            const doc = this.firestore.collection(this.name)
                                      .doc(record.id);

            batch.delete(doc);

        }

    }

}

export interface FirestoreProvider {
    (): FirestoreLike;
}

/**
 * A cursor for easily paging through all results on the data.
 */
export interface Cursor<T> {
    hasNext(): boolean;
    next(): Promise<ReadonlyArray<T>>;
}

export interface IterateOpts {
    readonly limit?: number;
    readonly offset?: number;
    readonly startAfter?: any[];
    readonly startAt?: any[];
    readonly orderBy?: ReadonlyArray<OrderByClause>;
}

export type OrderByClause = [string, OrderByDirectionLike | undefined];

export interface ListOpts extends IterateOpts {
}

export type ValueType = object | string | number;

export type Clause = [string, WhereFilterOpLike, ValueType];

export class Clauses {

    public static assertPresent(clause: Clause) {
        const [field, op, value] = clause;
        Preconditions.assertPresent(value, 'value missing for field ' + field);
    }

    public static fields(clauses: ReadonlyArray<Clause>) {
        return clauses.map(current => current[0]);
    }

    public static values(clauses: ReadonlyArray<Clause>) {
        return clauses.map(current => current[2]);
    }

}

export interface IDRecord {
    readonly id: string;
}

export interface GetOrCreateRecord<T> {
    readonly created: boolean;
    readonly record: T;
}

// *** firestore and firestore-admin interface

export interface FirestoreLike {
    collection(collectionPath: string): CollectionReferenceLike;
}

export interface WriteBatchLike {
    create(documentRef: DocumentReferenceLike, data: DocumentDataLike): WriteBatchLike;
    delete(documentRef: DocumentReferenceLike): WriteBatchLike;
}

export interface DocumentReferenceLike {
    get(): Promise<DocumentSnapshotLike>;
    set(data: DocumentDataLike, options?: SetOptionsLike): Promise<any>;
}

export interface SetOptionsLike {

    /**
     * Changes the behavior of a set() call to only replace the values specified
     * in its data argument. Fields omitted from the set() call remain
     * untouched.
     */
    readonly merge?: boolean;
}

export interface WriteResultLike {

    /**
     * The write time as set by the Firestore servers.
     */
    readonly writeTime: TimestampLike;

}

export interface TimestampLike {

}

export interface DocumentSnapshotLike {
    readonly exists: boolean;
    data(): DocumentDataLike | undefined;
}

export interface CollectionReferenceLike {
    doc(documentPath: string): DocumentReferenceLike;
    where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
    limit(size: number): QueryLike;
}

export type DocumentDataLike = {[field: string]: any};

export interface QueryLike {
    get(): Promise<QuerySnapshotLike>;
    where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
    limit(limit: number): QueryLike;
    offset(offset: number): QueryLike;
    orderBy(fieldPath: string, directionStr?: OrderByDirectionLike): QueryLike;
    // orderByKey(): QueryLike;
    startAt(...fieldValues: any[]): QueryLike;
    startAfter(...fieldValues: any[]): QueryLike;
    endAt(...fieldValues: any[]): QueryLike;
    endBefore(...fieldValues: any[]): QueryLike;
}
export type WhereFilterOpLike = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';

export type OrderByDirectionLike = 'desc' | 'asc';

export interface QuerySnapshotLike {
    readonly docs: QueryDocumentSnapshotLike[];

}
export interface QueryDocumentSnapshotLike {
    data(): DocumentDataLike;
    get(fieldPath: string): any;
}

/**
 * A Firebase UID string for a user.
 */
export type UserIDStr = string;

/**
 * The name of a collection.
 */
export type CollectionNameStr = string;

/**
 * The type of primitives that Firestore supports.
 */
export type FirestorePrimitive = string | number | boolean | null;

// TODO: this entire system of object typing for Firestore needs work.  The 'arrays' we specify can not
// be regular arrays but must be number indexed dictionaries.

export interface FirestoreTypedArray<T extends FirestorePrimitive | FirestoreDict | FirebaseDictTyped<T>> {
    readonly [id: number]: T;
}

/**
 * An array type that accepts.  This syntax prevents .includes() from working since it's
 * not actually a real dictionary.
 */
export interface FirestoreArray {
    readonly [id: number]: FirestoreDict | FirestoreArray | FirestorePrimitive;
}

export type FirebaseDictTyped<T> = {
    readonly [P in keyof T]: FirestorePrimitive;
};

export interface FirestoreDict {
    readonly [id: string]: FirestoreDict | FirestoreArray | FirestorePrimitive | FirebaseDictTyped<any>;
}


// export interface FirestoreDict2<T> {
//     readonly [id: keyof T]: FirestorePrimitive;
// }

export type FirestoreValue = FirestoreDict | FirestoreArray | FirestorePrimitive;
