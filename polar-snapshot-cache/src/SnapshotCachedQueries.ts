import {IQuerySnapshot} from "./store/IQuerySnapshot";
import {ISnapshotCachedQuery} from "./ISnapshotCachedQuery";
import {ISnapshotCacheQueryDocument} from "./ISnapshotCacheQueryDocument";
import {IQueryDocumentSnapshot} from "./store/IQueryDocumentSnapshot";
import {IDocumentChange} from "./store/IDocumentChange";

export namespace SnapshotCachedQueries {

    export function toCache(snapshot: IQuerySnapshot): ISnapshotCachedQuery {

        const docs = snapshot.docs;

        function toDoc(doc: IQueryDocumentSnapshot): ISnapshotCacheQueryDocument {
            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
                data: doc.data()
            };
        }

        return {
            empty: snapshot.empty,
            size: snapshot.size,
            metadata: {...snapshot.metadata},
            docs: docs.map(toDoc)
        }

    }

    export function fromCache(snapshot: ISnapshotCachedQuery): IQuerySnapshot {

        function toDoc(doc: ISnapshotCacheQueryDocument): IQueryDocumentSnapshot {
            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
                data: () => doc.data
            };
        }


        function toDocChange(doc: IQueryDocumentSnapshot): IDocumentChange {
            return {
                type: 'added',
                doc
            }
        }

        const docs = snapshot.docs.map(toDoc);

        const docChanges = (): ReadonlyArray<IDocumentChange> => {
            return docs.map(toDocChange)
        }

        return {
            empty: snapshot.empty,
            size: snapshot.size,
            metadata: {...snapshot.metadata},
            docs,
            docChanges
        }

    }

}