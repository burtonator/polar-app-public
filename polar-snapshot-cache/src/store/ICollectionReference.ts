import {IGetOptions} from "./IGetOptions";

export interface ICollectionReference {

    readonly doc:(documentPath?: string) => IDocumentReference<T>;

    // readonly get(options?: IGetOptions) => Promise<QuerySnapshot<T>>;

    // FIXME doc
    // FIXME onSnapshot

}
