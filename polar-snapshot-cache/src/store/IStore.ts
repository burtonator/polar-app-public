import {ICollectionReference} from "./ICollectionReference";

export interface IStore {
    readonly collection: (collectionName: string) => ICollectionReference;
}