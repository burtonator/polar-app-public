import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ISnapshotMetadata} from "./store/ISnapshotMetadata";

export interface ICachedQuery {

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<ICacheQueryDocument>;

}
