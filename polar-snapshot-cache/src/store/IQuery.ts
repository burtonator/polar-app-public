import {IGetOptions} from "./IGetOptions";
import {IQuerySnapshot} from "./IQuerySnapshot";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {IFirestoreError} from "./IFirestoreError";
import {TWhereFilterOp} from "./ICollectionReference";

export type SnapshotUnsubscriber = () => void;

export type TOrderByDirection = 'desc' | 'asc';

export interface IQueryOrderBy {
    readonly fieldPath: string;
    readonly directionStr?: TOrderByDirection;
}

export interface IQuerySnapshotObserver {
    readonly next?: (snapshot: IQuerySnapshot) => void;
    readonly error?: (error: IFirestoreError) => void;
    readonly complete?: () => void;
}

export function isQuerySnapshotObserver(arg: any): arg is IQuerySnapshotObserver {
    return arg.next !== undefined || arg.error !== undefined || arg.complete !== undefined;
}

export interface IQuery {

    where(fieldPath: string, opStr: TWhereFilterOp, value: any): IQuery;

    get(options?: IGetOptions): Promise<IQuerySnapshot>;

    // TODO: we need these other onSnapshot methods.

    onSnapshot(observer: IQuerySnapshotObserver): SnapshotUnsubscriber;

    onSnapshot(options: ISnapshotListenOptions,
               observer: IQuerySnapshotObserver): SnapshotUnsubscriber;

    onSnapshot(onNext: (snapshot: IQuerySnapshot) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

    onSnapshot(options: ISnapshotListenOptions,
               onNext: (snapshot: IQuerySnapshot) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

    /**
     * Limit the number of results returned.
     */
    limit(count: number): IQuery;

    // You can also order by multiple fields. For example, if you wanted to
    // order by state, and within each state order by population in descending
    // order:
    orderBy(fieldPath: string, directionStr?: TOrderByDirection): IQuery;

    startAfter(startAfter: string | undefined): IQuery;

}
