import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ISnapshotMetadata} from "./store/ISnapshotMetadata";
import {IWhereClause} from "./store/ICollectionReference";

export interface ICachedQuery {

    /**
     * The name of the collection that this query is caching.
     */
    readonly collection: string;

    /**
     * The clauses for this query.
     */
    readonly clauses: ReadonlyArray<IWhereClause>;

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<ICacheQueryDocument>;

}
