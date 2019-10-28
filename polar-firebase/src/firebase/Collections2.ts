import {Preconditions} from "polar-shared/src/Preconditions";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Arrays} from "polar-shared/src/util/Arrays";

/**
 * Generic functions for working with Firebase collections
 */
export class Collections {

    public constructor(private firestore: FirestoreLike) {

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

    public async getByID<T>(collection: string, id: string): Promise<T | undefined> {


        const userGroupRef = this.firestore.collection(collection).doc(id);
        const doc = await userGroupRef.get();
        return <T> doc.data();

    }

    public async getByFieldValue<T>(collection: string, field: string, value: ValueType): Promise<T | undefined> {
        const results = await this.list<T>(collection, [[field, '==', value]]);
        return this.first(collection, [field], results);
    }

    public async getByFieldValues<T>(collection: string, clauses: ReadonlyArray<Clause>): Promise<T | undefined> {
        const results = await this.list<T>(collection, clauses);

        const fields = clauses.map(current => current[0]);

        return this.first(collection, fields, results);
    }

    private first<T>(collection: string,
                     fields: ReadonlyArray<string>,
                     results: ReadonlyArray<T>): T | undefined {

        if (results.length === 0) {
            return undefined;
        } else if (results.length === 1) {
            return results[0];
        } else {
            throw new Error(`Too many records on collection ${collection} for fields ${fields} ` + results.length);
        }

    }

    public async listByFieldValue<T>(collection: string, field: string, value: ValueType): Promise<ReadonlyArray<T>> {
        return this.list(collection, [[field, '==', value]]);
    }

    private createQuery(collection: string,
                        clauses: ReadonlyArray<Clause>,
                        opts: ListOpts = {}) {

        const clause = clauses[0];
        const [field, op, value] = clause;

        Clauses.assertPresent(clause);

        let query = this.firestore
            .collection(collection)
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

    public async list<T>(collection: string,
                         clauses: ReadonlyArray<Clause>,
                         opts: ListOpts = {}): Promise<ReadonlyArray<T>> {

        const query = this.createQuery(collection, clauses, opts);

        const snapshot = await query.get();

        return this.snapshotToRecords(snapshot);

    }

    public async iterate<T>(collection: string,
                            clauses: ReadonlyArray<Clause>,
                            opts: IterateOpts = {}): Promise<Cursor<T>> {

        const limit = opts.limit || 100;

        let startAfter: any[] | undefined;

        // we always have at least one page...
        let hasNext: boolean = true;

        const next = async (): Promise<ReadonlyArray<T>> => {

            const query = this.createQuery(collection, clauses, {...opts, startAfter});
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
        }

    }

    public async deleteByID(batch: WriteBatchLike,
                            collection: string,
                            provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const records = await provider();

        for (const record of records) {

            const doc = this.firestore.collection(collection)
                                      .doc(record.id);

            batch.delete(doc);

        }

    }

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
    get():  Promise<DocumentSnapshotLike>;
}

export interface DocumentSnapshotLike {
    readonly exists: boolean;
    data(): DocumentDataLike | undefined;
}

export interface CollectionReferenceLike {
    doc(documentPath: string): DocumentReferenceLike;
    where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
}

export type DocumentDataLike = {[field: string]: any};

export interface QueryLike {
    get(): Promise<QuerySnapshotLike>;
    where(fieldPath: string, opStr: WhereFilterOpLike, value: any): QueryLike;
    limit(limit: number): QueryLike;
    offset(offset: number): QueryLike;
    orderBy(fieldPath: string, directionStr?: OrderByDirectionLike): QueryLike;
    startAt(...fieldValues: any[]): QueryLike;
    startAfter(...fieldValues: any[]): QueryLike;
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
