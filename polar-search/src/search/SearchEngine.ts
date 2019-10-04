import {ISODateString, ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {URLStr} from "polar-shared/src/util/Strings";

export namespace search {

    export interface Request {

        /**
         * The query to execute as a query string specific to each provider.  For example
         * some take just a raw DOI.  Some take a title or author syntax.
         */
        readonly q: QueryStr;

        /**
         * The specific page to fetch.  You should first execute the request on page 0
         * and then the response will give you information on how many pages are left
         * to fetch.
         */
        readonly page?: number;

    }

    /**
     * Responsible for creating search engines by matching the query to the
     * implementation.
     */
    export interface IEngineFactory {

        /**
         * Get engines that can execute the given query.  The engine is created
         * but doesn't yet have a search executed.
         */
        getEngines(query: QueryStr): Promise<ReadonlyArray<Engine>>;

    }

    export interface Engine {

        /**
         * A unique id for the search engine.
         */
        id: EngineIDStr;

        /**
         * Run a search and provide a results object to allow us to iterate
         * through the results.
         *
         * The query is given to the Engine from the IEngineFactory.
         *
         */
        executeQuery(): Promise<Results>;

    }

    export type EngineIDStr = string;

    /**
     * A basic query string.
     */
    export type QueryStr = string;

    export interface Pagination {

        /**
         * The total number of results available.
         */
        readonly total: number;

        readonly itemsPerPage: number;

        readonly page: number;

    }

    /**
     *
     */
    export interface Results {

        // Example APIs that we should support.

        // http://export.arxiv.org/api/query?search_query=all:electron
        // https://api.unpaywall.org/v2/10.1038/nature12373?email=YOUR_EMAIL

        readonly pagination: Pagination;

        /**
         * Gets the current search page, possibly executing the query for the first
         * time.
         */
        current(): Promise<Page | undefined>;

        /**
         * Advanced the results to the next page.
         */
        next(): Promise<Page | undefined>;

        /**
         * Return true if the search result has a current page.
         */
        hasCurrent(): Promise<boolean>;

        /**
         * True if we have another page of results.
         */
        hasNext(): Promise<boolean>;

    }

    export interface Page {

        /**
         * All the entries on this page.
         */
        readonly entries: ReadonlyArray<Entry>;

    }

    export type LicenseType = 'openaccess';

    export interface Entry {

        /**
         * Unique ID for this search result entry.
         */
        readonly id: string;

        readonly published: ISODateTimeString | ISODateString;

        readonly updated?: ISODateTimeString | ISODateString;

        readonly title?: string;

        readonly summary?: ContentStr;

        readonly publisher?: string;

        readonly links: ReadonlyArray<DocLink>;

        readonly doi?: DOIStr;

        readonly pmid?: PMIDStr;

        readonly journal?: string;

        readonly license?: LicenseType | string;

        readonly authors?: ReadonlyArray<Author>;

    }

    /**
     * Represent text or html content and includes a basic type field so we can
     * determine the difference.
     */
    export interface ContentStr {

        readonly type: ContentStrType;

        readonly value: string;

    }

    export type ContentStrType = 'text' | 'html';

    export interface Author {

        readonly displayName: string;

        readonly firstName?: string;

        readonly lastName?: string;

        readonly affiliation?: string;

    }

    export interface DocLink {
        readonly type: DocContentType;
        readonly href: string;
        readonly disposition?: DocLinkDisposition;

        /**
         * The institution hosting this download
         */
        readonly institution?: string;

    }

    export type DocContentType = 'application/pdf' | 'text/html';

    /**
     * Used so that we know what type of link this is.  Is it for downloading the
     * paper, a landing page for more information, etc.
     */
    export type DocLinkDisposition = 'download' | 'landing';

    /**
     * A string formatted as a DOI 10.1038/nature12373
     */
    export type DOIStr = string;

    /**
     * PubMed ID string.
     */
    export type PMIDStr = string;

    /**
     * Simple single page of results.
     */
    export class SinglePageResults implements Results {

        public readonly total: number;

        private currentPage?: Page;

        private nextPage?: Page;

        public readonly pagination: Pagination;

        constructor(private readonly page: Page) {
            this.total = page.entries.length;
            this.nextPage = page;

            this.pagination = {
                total: page.entries.length,
                itemsPerPage: page.entries.length,
                page: 0
            }

        }

        public async current(): Promise<search.Page | undefined> {
            return this.currentPage;
        }

        public async hasCurrent(): Promise<boolean> {
            return this.currentPage !== undefined;
        }

        public async hasNext(): Promise<boolean> {
            return this.nextPage !== undefined;
        }

        public async next(): Promise<search.Page | undefined> {

            this.currentPage = this.nextPage;
            this.nextPage = undefined;

            return this.currentPage;

        }

    }

    // TODO: this is a Link now....
    // export type DownloadContentType = 'application/pdf';
    //
    // export interface DownloadURL {
    //
    //     readonly primary: boolean;
    //     readonly contentType: DownloadContentType;
    //     readonly license?: string;
    //
    //     readonly landingURL: URLStr;
    //
    //     readonly downloadURL: URLStr;
    //
    //     /**
    //      * The institution hosting this download
    //      */
    //     readonly institution: string;
    //
    // }

}
