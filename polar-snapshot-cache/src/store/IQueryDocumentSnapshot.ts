import {TDocumentData} from "./TDocumentData";
import {IDocumentSnapshot} from "./IDocumentSnapshot";

export interface IQueryDocumentSnapshot extends IDocumentSnapshot {

    readonly data: () => TDocumentData;

}