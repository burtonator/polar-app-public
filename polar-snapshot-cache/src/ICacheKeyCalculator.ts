import { IDocumentSnapshot } from "./store/IDocumentSnapshot";
import {IDocumentReference} from "./store/IDocumentReference";

export interface ICacheKeyCalculator {

    /**
     * Given a document snapshot,  Usually we use the doc ID for this snapshot.
     */
    readonly computeForDoc: (collectionName: string, documentSnapshot: IDocumentSnapshot | IDocumentReference) => string;

    /**
     * Compute the cache key for an entire snapshot.  We need to use a unique
     * snapshot key for each type of snapshot query so that they aren't
     * intermingled.
     */
    readonly computeForQuery: (collectionName: string) => string;

}