import {IWhereClause} from "./store/ICollectionReference";
import { IQueryOrderBy } from "./store/IQuery";

/**
 * The metadata for a cached query including the collection, clauses, limit, and
 * orderBy used.
 */
export interface ICachedQueryMetadata {

    readonly collection: string;

    readonly clauses: ReadonlyArray<IWhereClause>;

    readonly limit: number | undefined;

    readonly order: ReadonlyArray<IQueryOrderBy>;

}
