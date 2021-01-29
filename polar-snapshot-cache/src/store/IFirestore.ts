import {ICollectionReference} from "./ICollectionReference";
import {IWriteBatch} from "./IWriteBatch";

/**
 * Firestore mimic interface.
 */
export interface IFirestore {

    readonly collection: (collectionName: string) => ICollectionReference;

    readonly batch: () => IWriteBatch;

    readonly terminate: () => Promise<void>;

    readonly clearPersistence: () => Promise<void>;

}
