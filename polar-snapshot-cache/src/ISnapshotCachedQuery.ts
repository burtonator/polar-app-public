import {IQueryDocumentSnapshot} from "./store/IQueryDocumentSnapshot";

export interface ISnapshotCachedQuery<V> {

    /**
     * false if this value is cached as a negative entry.  This can be used to
     * listen to snapshot values which don't exist.
     */
    readonly exists: boolean;

    // FIXME this is confusing because there are too many nested structures here...
    readonly doc: ReadonlyArray<IQueryDocumentSnapshot> | undefined;

}
