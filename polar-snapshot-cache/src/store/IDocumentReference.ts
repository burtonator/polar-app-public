import { IDocumentSnapshot } from "./IDocumentSnapshot";
import {IGetOptions} from "./IGetOptions";
import {ICollectionReference} from "./ICollectionReference";

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export interface IDocumentReference {

    /**
     * The Collection this `DocumentReference` belongs to.
     */
    readonly parent: ICollectionReference;

    readonly id: string;

    readonly get: (options?: IGetOptions) => Promise<IDocumentSnapshot>;
}