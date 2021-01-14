import {IStore} from "../IStore";
import {SnapshotCacheProvider} from "../../SnapshotCacheProvider";
import {ICacheKeyCalculator} from "../../ICacheKeyCalculator";
import {ICollectionReference} from "../ICollectionReference";
import {IWriteBatch} from "../IWriteBatch";
import {IDocumentReference} from "../IDocumentReference";

export namespace CachedStore {

    export function create(delegate: IStore,
                           snapshotCacheProvider: SnapshotCacheProvider,
                           cacheKeyCalculator: ICacheKeyCalculator): IStore {

        function collection(collectionName: string): ICollectionReference {

            const _collection = delegate.collection(collectionName);

            function doc(documentPath?: string): IDocumentReference {

                const _doc = _collection.doc(documentPath);

                // return {
                //     parent: _doc.parent,
                //     id: _doc.id,
                //
                // }

                return null!;

            }

            // return {
            //     id: _collection.id,
            // }

            return null!;

        }

        function batch(): IWriteBatch {

            return null!;
        }

        return {collection, batch};

    }

}