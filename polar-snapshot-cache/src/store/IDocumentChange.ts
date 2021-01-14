import {IQueryDocumentSnapshot} from "./IQueryDocumentSnapshot";

export type TDocumentChangeType = 'added' | 'modified' | 'removed';

export interface IDocumentChange {

    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: TDocumentChangeType;

    /** The document affected by this change. */
    readonly doc: IQueryDocumentSnapshot;

}