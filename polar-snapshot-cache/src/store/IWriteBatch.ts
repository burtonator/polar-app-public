import {IDocumentReference} from "./IDocumentReference";
import {TDocumentData} from "./TDocumentData";

export type TFieldPath = any;

export interface IWriteBatch {

    /**
     * The implementation needs to delete this from the cache.
     */
    delete(documentRef: IDocumentReference): IWriteBatch;

    set(documentRef: IDocumentReference, data: TDocumentData): IWriteBatch;

    // update(documentRef: IDocumentReference, data: TUpdateData): IWriteBatch;

    update(documentRef: IDocumentReference, field: string | TFieldPath, value: any): IWriteBatch;

    // update(
    //     documentRef: DocumentReference<any>,
    //     field: string | FieldPath,
    //     value: any,
    //     ...moreFieldsAndValues: any[]
    // ): WriteBatch;

    commit(): Promise<void>;

}
