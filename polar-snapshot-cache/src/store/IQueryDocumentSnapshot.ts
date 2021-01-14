import {TDocumentData} from "./TDocumentData";

export interface IQueryDocumentSnapshot {
    readonly data: () => TDocumentData;

}