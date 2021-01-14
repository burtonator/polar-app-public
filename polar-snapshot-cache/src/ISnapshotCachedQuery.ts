import {ISnapshotCacheQueryDocument} from "./ISnapshotCacheQueryDocument";
import {ISnapshotMetadata} from "./store/ISnapshotMetadata";

export interface ISnapshotCachedQuery {

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<ISnapshotCacheQueryDocument>;

}
