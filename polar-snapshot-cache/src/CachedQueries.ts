import {IQuerySnapshot} from "./store/IQuerySnapshot";
import {ICachedQuery} from "./ICachedQuery";
import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {IQueryDocumentSnapshot} from "./store/IQueryDocumentSnapshot";
import {IDocumentChange} from "./store/IDocumentChange";

export namespace CachedQueries {

    export function toCache(snapshot: IQuerySnapshot): ICachedQuery {

        const docs = snapshot.docs;

        function toDoc(doc: IQueryDocumentSnapshot): ICacheQueryDocument {
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

    export function fromCache(snapshot: ICachedQuery): IQuerySnapshot {

        function toDoc(doc: ICacheQueryDocument): IQueryDocumentSnapshot {
            return {
                exists: doc.exists,
                id: doc.id,
                metadata: {...doc.metadata},
                data: () => doc.data
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