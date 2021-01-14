import {IGetOptions} from "./IGetOptions";
import {IQuerySnapshot} from "./IQuerySnapshot";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {IFirestoreError} from "./IFirestoreError";
import {TWhereFilterOp} from "./ICollectionReference";

export type SnapshotUnsubscriber = () => void;

export interface IQuery {

    where(fieldPath: string, opStr: TWhereFilterOp, value: any): IQuery;

    get(options?: IGetOptions): Promise<IQuerySnapshot>;

    onSnapshot(options: ISnapshotListenOptions,
               onNext: (snapshot: IQuerySnapshot) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

}