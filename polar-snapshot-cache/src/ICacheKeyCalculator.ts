import { IDocumentSnapshot } from "./store/IDocumentSnapshot";

export interface ICacheKeyCalculator {

    /**
     * Given a document snapshot,  Usually we use the doc ID for this snapshot.
     */
    readonly computeForDoc: (documentSnapshot: IDocumentSnapshot) => string;

    /**
     * Compute the cache key for an entire snapshot.  We need to use a unique
     * snapshot key for each type of snapshot query so that they aren't
     * intermingled.
     */
    readonly computeForSnapshot: () => string;

}