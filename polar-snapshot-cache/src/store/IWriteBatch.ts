import {IDocumentReference} from "./IDocumentReference";
import {TDocumentData} from "./TDocumentData";

export interface IWriteBatch {

    /**
     * The implementation needs to delete this from the cache.
     */
    delete(documentRef: IDocumentReference): IWriteBatch;

    set<T>(documentRef: IDocumentReference, data: TDocumentData): IWriteBatch;

    commit(): Promise<void>;

}