import { IQueryDocumentSnapshot } from "./IQueryDocumentSnapshot";
import {ISnapshotMetadata} from "./ISnapshotMetadata";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import { IDocumentChange } from "./IDocumentChange";

export interface IQuerySnapshot {

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<IQueryDocumentSnapshot>;

    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as added changes.
     *
     * @param options `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */
    readonly docChanges: (options?: ISnapshotListenOptions) => ReadonlyArray<IDocumentChange>;

}