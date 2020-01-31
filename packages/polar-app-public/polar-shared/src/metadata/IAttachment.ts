import {BackendFileRef} from "../datastore/BackendFileRef";

export interface IAttachment {

    /**
     * The data for this attachment as stored as a file ref.
     */
    readonly fileRef: BackendFileRef;

}

