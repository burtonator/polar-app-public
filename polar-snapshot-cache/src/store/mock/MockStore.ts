import {TDocumentData} from "../TDocumentData";
import {IWriteBatch} from "../IWriteBatch";
import {IDocumentReference} from "../IDocumentReference";
import {ICollectionReference} from "../ICollectionReference";
import { IFirestore } from "../IFirestore";
import {TUpdateData} from "../TUpdateData";

/**
 * This is a mock store that works just like Firestore but runs out of RAM so that
 * testing is super simple.
 */
export namespace MockStore {

    type CollectionData = {[id: string]: TDocumentData}

    const collections: {[name: string]: CollectionData} = {};

    function requireCollection(collectionName: string) {

        if (! collections[collectionName]) {
            collections[collectionName] = {};
        }

    }

    export function create(): IFirestore {

        function collection(collectionName: string): ICollectionReference {
            //
            // function doc(documentPath?: string): IDocumentReference {
            //
            //
            //     return {
            //         parent: collectionName,
            //         id: documentPath
            //     }
            //
            // }
            //
            // return {
            //     id: collectionName
            // }

            return null!;

        }

        class Batch implements IWriteBatch {

            delete(documentRef: IDocumentReference): IWriteBatch {
                const collectionName = documentRef.parent.id;
                requireCollection(collectionName);
                delete collections[collectionName][documentRef.id];
                return this;
            }

            set(documentRef: IDocumentReference, data: TDocumentData): IWriteBatch {
                const collectionName = documentRef.parent.id;
                requireCollection(collectionName);
                collections[collectionName][documentRef.id] = data;
                return this;
            }

            // update(documentRef: IDocumentReference, data: TUpdateData): IWriteBatch {
            //     throw new Error("Not implemented");
            // }

            update(documentRef: IDocumentReference, path: string, value: any): IWriteBatch {
                throw new Error("Not implemented");
            }


            async commit(): Promise<void> {
                // noop
            }

        }

        function batch(): IWriteBatch {
            return new Batch();
        }

        // return {batch};

        return null!;

    }

}
