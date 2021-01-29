import {IWhereClause} from "./store/ICollectionReference";

/**
 * The metadata for a cached query including the collection, clauses, limit, and
 * orderBy used.
 */
export interface ICachedQueryMetadata {

    readonly collection: string;

    readonly clauses: ReadonlyArray<IWhereClause>;

    readonly limit: number | undefined;

    readonly orderBy: ReadonlyArray<string> | undefined;

}
