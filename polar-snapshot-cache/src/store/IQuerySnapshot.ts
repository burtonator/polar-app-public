import { IQueryDocumentSnapshot } from "./IQueryDocumentSnapshot";

export interface IQuerySnapshot {
    readonly empty: boolean;
    readonly size: number;
    readonly docs: ReadonlyArray<IQueryDocumentSnapshot>;
}