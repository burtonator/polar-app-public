import { IDocumentSnapshot } from "./IDocumentSnapshot";
import {IGetOptions} from "./IGetOptions";

export interface IDocumentReference {
    readonly get: (options?: IGetOptions) => Promise<IDocumentSnapshot>;
}