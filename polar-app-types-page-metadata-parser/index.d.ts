declare module 'page-metadata-parser' {

    export function getMetadata(document: Document, location: string): PageMetadata;

    export type URLStr = string;

    export interface PageMetadata {

        // TODO: could use the following metadata:
        //
        // width/height of image when present

        // description	A user displayable description for the page.
        // icon	A URL which contains an icon for the page.
        // image	A URL which contains a preview image for the page.
        // keywords	The meta keywords for the page.
        // provider	A string representation of the sub and primary domains.
        // title	A user displayable title for the page.
        // type	The type of content as defined by opengraph.
        // url	A canonical URL for the page.

        readonly description: string;
        readonly icon: URLStr;
        readonly image: URLStr;
        readonly provider: string;
        readonly title: string;
        readonly type: string;
        readonly url: URLStr;

    }
}


