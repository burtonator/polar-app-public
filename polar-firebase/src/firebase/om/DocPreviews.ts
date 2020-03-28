import {
    CollectionNameStr,
    Collections,
    FirestoreProvider
} from "../Collections";

import {IDocDetail} from "polar-shared/src/metadata/IDocDetail";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {SlugStr} from "polar-shared/src/util/Slugs";

export interface BaseDocPreview extends IDocDetail {

    readonly id: IDStr;

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

    // /**
    //  * True if this entry is broken , IE the URL could not be fetched so that
    //  * we can mark this dead and not show up in the UI.
    //  */
    // readonly broken?: true | undefined;

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

    /**
     * The slug of the document that's computed from the title.  We use this
     * to compute the full URL
     */
    readonly slug: SlugStr | undefined;

}

export interface DocPreviewUncached extends BaseDocPreview {

    readonly cached: false;

}

export type DocPreview = DocPreviewCached | DocPreviewUncached;

export interface Range {
    readonly start: IDStr;
    readonly end: IDStr;
}

export interface ListOpts {
    readonly size: number;
    readonly range?: Range;
}

export class DocPreviews {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "doc_preview";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async set(doc: DocPreview): Promise<DocPreview> {
        await this.collections().set(doc.id, doc);
        return doc;
    }

    public static async list(opts: ListOpts): Promise<ReadonlyArray<DocPreview>> {

        const createQuery = () => {

            if (opts.range) {

                console.log("Using range query for: ", opts.range);

                // go over a range so that we can specify a subset of the
                // documents for faster response times.

                return this.collections()
                           .collection()
                           .limit(opts.size)
                           .orderBy('urlHash', 'asc')
                           .startAt(opts.range.start)
                           .endBefore(opts.range.end);
                
            }

            console.log("Using full list query");

            return this.collections().collection().limit(opts.size);

        };

        const query = createQuery();

        const snapshot = await query.get();

        return snapshot.docs.map(doc => doc.data() as DocPreview);
    }

    public static async get(id: IDStr): Promise<DocPreview | undefined> {
        return this.collections().get(id);
    }

}
