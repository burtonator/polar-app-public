import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ISnapshotMetadata} from "./store/ISnapshotMetadata";
import {IWhereClause} from "./store/ICollectionReference";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";

export interface ICachedQuery extends ICachedQueryMetadata{

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<ICacheQueryDocument>;

}
