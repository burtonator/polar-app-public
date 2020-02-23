import {
    CollectionNameStr,
    Collections,
    FirestoreProvider
} from "../Collections";

import {IDocDetail} from "polar-shared/src/metadata/IDocDetail";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";

export interface DocPreview extends IDocDetail {

    /**
     * The hashcode for the doc.
     */
    readonly hashcode: IDStr;

    /**
     * The URL for the doc in GCM
     */
    readonly storageURL: URLStr;
}

export class DocPreviews {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "doc_preview";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async update() {

    }

}
