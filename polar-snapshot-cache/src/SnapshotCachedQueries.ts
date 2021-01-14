import {IQuerySnapshot} from "./store/IQuerySnapshot";
import {ISnapshotCachedQuery} from "./ISnapshotCachedQuery";
import {ISnapshotCacheQueryDocument} from "./ISnapshotCacheQueryDocument";
import {IQueryDocumentSnapshot} from "./store/IQueryDocumentSnapshot";

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

}