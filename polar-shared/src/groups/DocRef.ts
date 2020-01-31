import {Tag} from '../tags/Tags';
import {ISODateString} from '../metadata/ISODateTimeStrings';
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';

/**
 * A more lightweight document reference for using in GroupDoc and other places
 * where a doc is needed.
 */
export interface DocRef {

    /**
     * The docID of the document we have permission to access within this group.
     */
    readonly docID: DocIDStr;

    readonly fingerprint: string;

    readonly title: string;

    readonly subtitle?: string;

    readonly nrPages: number;

    readonly description?: string;

    readonly url?: string;

    // The user tags from this user for their version of this doc.  This
    // excludes special typed tags and folder tags
    readonly tags?: {[id: string]: Tag};

    readonly published?: ISODateString | ISODateTimeString;

    readonly doi?: string;

}

export type DocIDStr = string;
