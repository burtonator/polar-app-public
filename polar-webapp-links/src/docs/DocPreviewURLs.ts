import {IDStr, URLStr} from "polar-shared/src/util/Strings";

export interface DocPreviewURLWithHashcode {
    readonly id: IDStr;
}

export interface DocPreviewURLWithHashcodeAndTitle {
    readonly id: IDStr;
    readonly title: string;
}

export interface DocPreviewURLWithHashcodeCategoryAndTitle {
    readonly id: IDStr;
    readonly category: string;
    readonly title: string;
}

export type DocPreviewURL = DocPreviewURLWithHashcode |
                            DocPreviewURLWithHashcodeAndTitle |
                            DocPreviewURLWithHashcodeCategoryAndTitle;

export class DocPreviewURLs {

    /**
     * The URLs are in the form of:
     *
     * https://app.getpolarized.io/d/linux/this+is+about+the+linux+kernel/0x12345
     *
     * The /d stands for 'doc'
     *
     * Then the rest can be arbitrary but is usually the category and then the
     * URL encoded title, followed by the document ID/hashcode as a suffix.
     *
     * The hashcode is the main part we care about and we can pull the rest from
     * there.
     *
     * This way the URL has metadata in it that MAY represent the category
     * but we can also include the title for SEO purposes too.
     */
    public static parse(url: URLStr): DocPreviewURL | undefined {

        const regexp = "(https://app\.getpolarized\.io)?/d/(([^/]+)/)?(([^/]+)/)?(0x[^/]+)$";

        const matches = url.match(regexp);

        if (! matches) {
            return undefined;
        }

        function parseRawID(rawHashcode: string) {
            return rawHashcode.substring(2);
        }

        // console.log("DEBUG: 1: " + matches[1]);
        // console.log("DEBUG: 2: " + matches[2]);
        // console.log("DEBUG: 3: " + matches[3]);
        // console.log("DEBUG: 4: " + matches[4]);
        // console.log("DEBUG: 5: " + matches[5]);

        const rawID = matches[6];
        const id = parseRawID(rawID);

        if (matches[3] && matches[4]) {
            // we have a category, title, and hashcode
            const category = decodeURIComponent(matches[3]);
            const title = decodeURIComponent(matches[5]);

            return {category, title, id};

        }

        if (matches[2]) {
            // we have a title, and hashcode
            const title = decodeURIComponent(matches[3]);
            return {title, id};

        }

        return {id};

    }

    public static create(doc: DocPreviewURL) {

        const opts = <any> doc;

        if (opts.category && opts.title) {
            return `https://app.getpolarized.io/d/${encodeURIComponent(opts.category)}/${encodeURIComponent(opts.title)}/0x${doc.id}`;
        }

        if (opts.title) {
            return `https://app.getpolarized.io/d/${encodeURIComponent(opts.title)}/0x${doc.id}`;
        }

        return `https://app.getpolarized.io/d/0x${doc.id}`;

    }

}
