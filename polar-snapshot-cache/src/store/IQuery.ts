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

export interface IQuery {

    where(fieldPath: string, opStr: TWhereFilterOp, value: any): IQuery;

    get(options?: IGetOptions): Promise<IQuerySnapshot>;

    // TODO: we need these other onSnapshot methods.

    // onSnapshot(observer: {
    //     next?: (snapshot: QuerySnapshot<T>) => void;
    //     error?: (error: FirestoreError) => void;
    //     complete?: () => void;
    // }): () => void;

    // onSnapshot(
    //     options: SnapshotListenOptions,
    //     observer: {
    //         next?: (snapshot: QuerySnapshot<T>) => void;
    //         error?: (error: FirestoreError) => void;
    //         complete?: () => void;
    //     }
    // ): () => void;

    // onSnapshot(
    //     onNext: (snapshot: QuerySnapshot<T>) => void,
    //     onError?: (error: FirestoreError) => void,
    //     onCompletion?: () => void
    // ): () => void;

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

}

