import { IDocumentSnapshot } from "./store/IDocumentSnapshot";
import {IDocumentReference} from "./store/IDocumentReference";
import {IDocumentChange} from "./store/IDocumentChange";
import {IWhereClause} from "./store/ICollectionReference";

export interface ICacheKeyCalculator {

    /**
     * Given a document snapshot,  Usually we use the doc ID for this snapshot.
     */
    readonly computeForDoc: (collectionName: string, documentSnapshot: IDocumentSnapshot | IDocumentReference | IDocumentChange) => string;

    readonly computeForQueryWithClauses: (collectionName: string, clauses: ReadonlyArray<IWhereClause>) => string;

}
