import {IDStr, PathStr, URLStr} from "polar-shared/src/util/Strings";
import {Slugs, SlugStr} from "polar-shared/src/util/Slugs";

// export interface DocPreviewURLWithHashcode {
//     readonly id: IDStr;
// }
//
// export interface DocPreviewURLWithHashcodeAndTitle {
//     readonly id: IDStr;
//     readonly title: string;
//     readonly slug: SlugStr;
// }
//
// export interface DocPreviewURLWithHashcodeCategoryAndTitle {
//     readonly id: IDStr;
//     readonly category: string;
//     readonly title: string;
//     readonly slug: SlugStr;
// }
//
// export type DocPreviewURL = DocPreviewURLWithHashcode |
//                             DocPreviewURLWithHashcodeAndTitle |
//                             DocPreviewURLWithHashcodeCategoryAndTitle;

export interface DocPreviewURL {
    readonly id: IDStr;
    readonly category: string | undefined;
    readonly title: string | undefined;
    readonly slug: SlugStr | undefined;
}

export interface ParsedDocPreviewURL {
    readonly id: IDStr;
    readonly category: string | undefined;
    readonly slug: SlugStr | undefined;
}

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
    public static parse(url: URLStr): ParsedDocPreviewURL | undefined {

        const regexp = "(https://app\.getpolarized\.io)?/d/(([^/]+)/)?(([^/]+)/)?(0x[^/?]+)$";

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
            const slug = decodeURIComponent(matches[5]);

            return {category, slug, id};

        }

        if (matches[2]) {
            // we have a title, and hashcode
            const slug = decodeURIComponent(matches[3]);
            return {slug, id, category: undefined};

        }

        return {id, slug: undefined, category: undefined};

    }

    public static canonicalize(url: URLStr | PathStr): string {

        const parsed  = DocPreviewURLs.parse(url);

        if (parsed) {

            if (parsed.category && parsed.slug) {
                return `/d/:category/:slug/:id`;
            }

            if (parsed.slug) {
                return `/d/:slug/:id`;
            }

            return `/d/:id`;

        }

        return url;

    }

    public static create(doc: DocPreviewURL) {

        const opts = <any> doc;

        const createSlugParam = (): string | undefined => {

            if (opts.slug) {
                // use the raw slug but encode it of course
                return encodeURIComponent(opts.slug);
            }

            if (opts.title) {
                // there is no slug so use the old title mechanism.  This should
                // not impact many URLs .... only about 700.
                return encodeURIComponent(opts.title);
            }

            return undefined;

        };

        const slug = createSlugParam();

        if (opts.category && slug) {

            const params = {
                category: encodeURIComponent(opts.category),
                slug
            };

            return `https://app.getpolarized.io/d/${params.category}/${params.slug}/0x${doc.id}`;
        }

        if (slug) {

            const params = {
                slug
            };

            return `https://app.getpolarized.io/d/${params.slug}/0x${doc.id}`;
        }

        return `https://app.getpolarized.io/d/0x${doc.id}`;

    }

}
