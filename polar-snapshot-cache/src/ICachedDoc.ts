import { ICachedDocMetadata } from "./ICachedDocMetadata";
import {TDocumentData} from "./store/TDocumentData";

export interface ICachedDoc extends ICachedDocMetadata {

    readonly id: string;

    /**
     * false if this value is cached as a negative entry.  This can be used to
     * listen to snapshot values which don't exist.
     */
    readonly exists: boolean;

    readonly data: TDocumentData | undefined;

}
