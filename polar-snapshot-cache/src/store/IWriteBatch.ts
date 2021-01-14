import {IDocumentReference} from "./IDocumentReference";
import {TDocumentData} from "./TDocumentData";

export interface IWriteBatch {

    /**
     * The implementation needs to delete this from the cache.
     */
    readonly delete: (documentRef: IDocumentReference) => IWriteBatch;

    set<T>(documentRef: IDocumentReference, data: TDocumentData): IWriteBatch;

    readonly commit: () => Promise<void>;

}