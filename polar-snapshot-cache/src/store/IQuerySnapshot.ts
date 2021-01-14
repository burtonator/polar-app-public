import { IQueryDocumentSnapshot } from "./IQueryDocumentSnapshot";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

export interface IQuerySnapshot {
    readonly empty: boolean;
    readonly size: number;
    readonly metadata: ISnapshotMetadata;
    readonly docs: ReadonlyArray<IQueryDocumentSnapshot>;
}