import {IQuerySnapshot} from "./store/IQuerySnapshot";
import {ICachedQuery} from "./ICachedQuery";
import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {IQueryDocumentSnapshot} from "./store/IQueryDocumentSnapshot";
import {IDocumentChange} from "./store/IDocumentChange";
import {ICachedDoc} from "./ICachedDoc";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";

export namespace CachedQueries {

    export function toCache(metadata: ICachedQueryMetadata,
                            snapshot: IQuerySnapshot): ICachedQuery {

        const docs = snapshot.docs;

        function toDoc(doc: IQueryDocumentSnapshot): ICacheQueryDocument {
            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
            };
        }

        return {
            ...metadata,
            empty: snapshot.empty,
            size: snapshot.size,
            metadata: {...snapshot.metadata},
            docs: docs.map(toDoc)
        }

    }

    export function fromCache(snapshot: ICachedQuery, index: {[id: string]: ICachedDoc}): IQuerySnapshot {



        function toDoc(doc: ICacheQueryDocument): IQueryDocumentSnapshot {

            const cacheEntry = index[doc.id];

            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
                data: () => cacheEntry.data!
            };
        }

        function toDocChange(doc: IQueryDocumentSnapshot): IDocumentChange {
            return {
                id: doc.id,
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
