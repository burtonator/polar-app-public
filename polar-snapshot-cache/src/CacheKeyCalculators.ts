import {ICacheKeyCalculator} from "./ICacheKeyCalculator";
import {IDocumentSnapshot} from "./store/IDocumentSnapshot";

export namespace CacheKeyCalculators {

    /**
     * Create a generic cache key calculator that uses the collection name and the id
     * of the document.  For snapshots, we use a snapshotKey such that EVERY snapshot
     * has the same key.
     *
     * We should
     */
    export function createGeneric(collectionName: string, snapshotKey: string): ICacheKeyCalculator {

        function computeForDoc(documentSnapshot: IDocumentSnapshot): string {
            return collectionName + ':' + documentSnapshot.id;
        }

        function computeForSnapshot(): string {
            return snapshotKey;
        }

        return {computeForDoc, computeForSnapshot};

    }


}