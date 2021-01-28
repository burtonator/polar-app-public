import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ISnapshotMetadata} from "./store/ISnapshotMetadata";

export interface ICachedQuery {

    // FIXME: also add the clauses for this so that we can know what the original was

    // FIXME String collection: the colleciton name...

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    // FIXME this should change to identifiers for the doc IDs that represent the query result.
    readonly docs: ReadonlyArray<ICacheQueryDocument>;

}
