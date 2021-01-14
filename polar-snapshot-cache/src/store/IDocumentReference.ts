import { IDocumentSnapshot } from "./IDocumentSnapshot";
import {IGetOptions} from "./IGetOptions";
import {ICollectionReference} from "./ICollectionReference";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {SnapshotUnsubscriber} from "./IQuery";
import {IFirestoreError} from "./IFirestoreError";
import {TDocumentData} from "./TDocumentData";

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export interface IDocumentReference {

    /**
     * The Collection this `DocumentReference` belongs to.
     */
    readonly parent: ICollectionReference;

    readonly id: string;

    get(options?: IGetOptions): Promise<IDocumentSnapshot>;
    set(data: TDocumentData): Promise<void>;
    delete(): Promise<void>;

    onSnapshot(
        options: ISnapshotListenOptions,
        onNext: (snapshot: IDocumentSnapshot) => void,
        onError?: (error: IFirestoreError) => void,
        onCompletion?: () => void
    ): SnapshotUnsubscriber;

    // onSnapshot(observer: {
    //     next?: (snapshot: IDocumentSnapshot) => void;
    //     error?: (error: IFirestoreError) => void;
    //     complete?: () => void;
    // }): () => void;
    //
    // onSnapshot(
    //     options: ISnapshotListenOptions,
    //     observer: {
    //         next?: (snapshot: IDocumentSnapshot) => void;
    //         error?: (error: IFirestoreError) => void;
    //         complete?: () => void;
    //     }
    // ): SnapshotUnsubscriber;
    //
    // onSnapshot(
    //     onNext: (snapshot: IDocumentSnapshot) => void,
    //     onError?: (error: IFirestoreError) => void,
    //     onCompletion?: () => void
    // ): () => void;

}