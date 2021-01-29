import {ICollectionReference} from "./ICollectionReference";
import {IWriteBatch} from "./IWriteBatch";

export interface IStore {

    readonly collection: (collectionName: string) => ICollectionReference;

    readonly batch: () => IWriteBatch;

    readonly terminate: () => Promise<void>;

    readonly clearPersistence: () => Promise<void>;

}
