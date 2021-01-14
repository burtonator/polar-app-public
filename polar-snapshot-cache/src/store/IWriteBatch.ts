import {IDocumentReference} from "./IDocumentReference";

export interface IWriteBatch {

    /**
     * The implementation needs to delete this from the cache.
     */
    readonly delete: (documentRef: IDocumentReference) => IWriteBatch;

    readonly commit: () => Promise<void>;

}