import { IDocumentReference } from "./IDocumentReference";
import {IQuery} from "./IQuery";

export type TWhereFilterOp =
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
    | 'not-in';

export type TWhereValue = number | string;

export interface IWhereClause {
    readonly fieldPath: string,
    readonly opStr: TWhereFilterOp;
    readonly value: TWhereValue;
}

export interface ICollectionReference {

    /** The collection's identifier. */
    readonly id: string;

    readonly doc: (documentPath?: string) => IDocumentReference;

    readonly where: (fieldPath: string, opStr: TWhereFilterOp, value: any) => IQuery;

    // readonly get(options?: IGetOptions) => Promise<QuerySnapshot<T>>;

    // FIXME doc
    // FIXME onSnapshot

}
