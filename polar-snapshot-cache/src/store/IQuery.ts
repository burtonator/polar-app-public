import {IGetOptions} from "./IGetOptions";
import {IQuerySnapshot} from "./IQuerySnapshot";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {IFirestoreError} from "./IFirestoreError";

export type SnapshotUnsubscriber = () => void;

export interface IQuery {

    readonly where: () => IQuery;

    readonly get: (options?: IGetOptions) => Promise<IQuerySnapshot>;

    readonly onSnapshot: (options: ISnapshotListenOptions,
                         onNext: (snapshot: IQuerySnapshot) => void,
                         onError?: (error: IFirestoreError) => void,
                         onCompletion?: () => void) => SnapshotUnsubscriber;

}