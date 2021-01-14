import { IDocumentReference } from "./IDocumentReference";

export interface ICollectionReference {

    readonly doc: (documentPath?: string) => IDocumentReference;

    // readonly get(options?: IGetOptions) => Promise<QuerySnapshot<T>>;

    // FIXME doc
    // FIXME onSnapshot

}
