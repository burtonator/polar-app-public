import {IVersionedObject} from "./IVersionedObject";
import {Tag} from "../tags/Tags";

export interface IAnnotation extends IVersionedObject {

    /**
     * Singular key/value pairs where the id is the lowercase representation
     * of a tag and value is the human/string representation.  By default we use
     * the tags on the docInfo but we can replace these with new / custom tags
     * for the doc if we want.
     */
    readonly tags?: {[id: string]: Tag};

    /**
     * True if the user has flagged this annotation.
     */
    readonly flagged?: boolean;

}
