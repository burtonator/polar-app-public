import { IDocumentSnapshot } from "./store/IDocumentSnapshot";
import {IDocumentReference} from "./store/IDocumentReference";
import {IDocumentChange} from "./store/IDocumentChange";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";

export interface ICacheKeyCalculator {

    /**
     * Given a document snapshot,  Usually we use the doc ID for this snapshot.
     */
    readonly computeForDoc: (collectionName: string, documentSnapshot: IDocumentSnapshot | IDocumentReference | IDocumentChange) => string;

    readonly computeForQuery: (metadata: ICachedQueryMetadata) => string;

}
