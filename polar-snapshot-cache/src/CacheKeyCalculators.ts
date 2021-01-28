import {ICacheKeyCalculator} from "./ICacheKeyCalculator";
import {IDocumentSnapshot} from "./store/IDocumentSnapshot";
import {IDocumentReference} from "./store/IDocumentReference";
import {IDocumentChange} from "./store/IDocumentChange";
import {IWhereClause} from "./store/ICollectionReference";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export namespace CacheKeyCalculators {

    /**
     * Create a generic cache key calculator that uses the collection name and the id
     * of the document.  For snapshots, we use a snapshotKey such that EVERY snapshot
     * has the same key.
     *
     * We should
     */
    export function createGeneric(snapshotCacheKey: string): ICacheKeyCalculator {

        function computeForDoc(collectionName: string, documentSnapshot: IDocumentSnapshot | IDocumentReference | IDocumentChange): string {
            return collectionName + ':' + documentSnapshot.id;
        }

        function computeForSnapshot(collectionName: string): string {
            return collectionName + ':' + snapshotCacheKey;
        }

        function computeForQueryWithClauses(collectionName: string, clauses: ReadonlyArray<IWhereClause>): string {
            return Hashcodes.create(collectionName + ':' + JSON.stringify(clauses));
        }


        return {computeForDoc, computeForQuery: computeForSnapshot, computeForQueryWithClauses};

    }

}
