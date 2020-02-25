import {
    CollectionNameStr,
    Collections,
    FirestoreProvider
} from "../Collections";

import {IDocDetail} from "polar-shared/src/metadata/IDocDetail";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {FirebaseAdmin} from "../../../../../polar-app-private/polar-hooks/functions/impl/util/FirebaseAdmin";

export interface BaseDocPreview extends IDocDetail {

    /**
     * The hashcode for the URL which we can lookup easily.
     */
    readonly urlHash: IDStr;

    /**
     * The original URL for this doc (PDF, EPUB, etc)
     */
    readonly url: URLStr;

    /**
     * The category for this doc.  Used to help SEO purposes
     */
    readonly category?: string;

}

export interface DocPreviewCached extends BaseDocPreview {

    /**
     * The hashcode for the doc.
     */
    readonly docHash: IDStr;

    /**
     * The URL for the doc cloud storage.
     */
    readonly datastoreURL: URLStr;

    readonly cached: true;

}

export interface DocPreviewUncached extends BaseDocPreview {

    readonly cached: false;

}

export type DocPreview = DocPreviewCached | DocPreviewUncached;

export class DocPreviews {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "doc_preview";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async set(doc: DocPreview) {
        await this.collections().set(doc.urlHash, doc);
    }

    public static async list(size: number): Promise<ReadonlyArray<DocPreview>> {
        const snapshot = await this.collections().collection().limit(size).get();
        return snapshot.docs.map(doc => doc.data() as DocPreview);
    }

    public static async get(id: IDStr): Promise<DocPreview | undefined> {
        return this.collections().get(id);
    }

}
