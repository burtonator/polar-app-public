import {TDocumentData} from "./store/TDocumentData";

export interface ICachedDoc {

    /**
     * false if this value is cached as a negative entry.  This can be used to
     * listen to snapshot values which don't exist.
     */
    readonly exists: boolean;

    readonly data: TDocumentData | undefined;

}