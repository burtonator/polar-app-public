import {TDocumentData} from "./TDocumentData";

export interface ICacheKeyCalculator {

    /**
     * Given a document, return the cache key.
     */
    readonly doc: (data: TDocumentData) => string;

    /**
     * Compute the cache key for an entire document.  We need to use a unique
     * snapshot key for each type of snapshot query so that they aren't
     * intermingled.
     */
    readonly snapshot: () => string;

}