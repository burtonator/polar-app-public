import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ISnapshotMetadata} from "./store/ISnapshotMetadata";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";

export interface ICachedQuery extends ICachedQueryMetadata {

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<ICacheQueryDocument>;

}
