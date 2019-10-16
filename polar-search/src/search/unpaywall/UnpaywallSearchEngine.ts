import {search} from "polar-search-api/src/api/search/Search";
import {ISODateString, ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Strings, URLStr} from "polar-shared/src/util/Strings";
import {Fetches} from "polar-shared/src/util/Fetch";

const EMAIL = 'unpaywall@getpolarized.io';

/**
 * https://unpaywall.org/products/api
 */
export class UnpaywallSearchEngine implements search.Engine {

    public static ID: search.SearchEngineID = 'unpaywall';

    public id: search.EngineIDStr = UnpaywallSearchEngine.ID;

    constructor(private readonly request: search.Request) {
    }

    public async executeQuery(): Promise<search.Results> {

        // https://api.unpaywall.org/v2/10.1038/nature12373?email=YOUR_EMAIL
        const url = `https://api.unpaywall.org/v2/${this.request.q}?email=${EMAIL}`;

        const res = await Fetches.fetch(url);

        const response: unpaywall.Response = await res.json();

        return UnpaywallSearchEngine.handleResponse(response);

    }

    public static async handleResponse(response: unpaywall.Response) {
        const entries = [this.toEntry(response)];
        return new search.SinglePageResults(entries);

    }

    private static toEntry(response: unpaywall.Response): search.Entry {

        const toLinks = (): ReadonlyArray<search.DocLink> => {

            const result: search.DocLink[] = [];

            for(const current of response.oa_locations) {
                result.push({
                    type: 'application/pdf',
                    href: current.url_for_pdf,
                    disposition: 'download'
                });

                result.push({
                    type: 'text/html',
                    href: current.url_for_landing_page,
                    disposition: 'landing'
                });

            }

            return result;

        };

        const toAuthors = (): ReadonlyArray<search.Author> => {

            const joinLR = (left: string, right: string): string => {

                const leftEmpty = Strings.empty(left);
                const rightEmpty = Strings.empty(right);

                if (! leftEmpty && ! rightEmpty) {
                    return `${left} ${right}`;
                }

                if (! leftEmpty) {
                    return left;
                }

                if (! rightEmpty) {
                    return right;
                }

                // they are both empty...
                return "";

            };

            return response.z_authors.map(current => {

                const displayName = joinLR(current.given, current.family);

                return {
                    displayName,
                    firstName: current.given,
                    lastName: current.family
                };

            })
        };

        const id = response.doi;
        const title = response.title;
        const doi = response.doi;
        const updated = response.updated;
        const published = response.published_date;
        const publisher = response.publisher;

        const links = toLinks();
        const authors = toAuthors();

        return {
            id,
            title,
            updated,
            published,
            publisher,
            links,
            authors,
            doi
        };

    }

}

export namespace unpaywall {

    import DOIStr = search.DOIStr;

    export interface Response {
        readonly doi: DOIStr;
        readonly updated: string;
        readonly title: string;
        readonly publisher: string;
        readonly z_authors: ReadonlyArray<Author>;
        readonly published_date: ISODateTimeString | ISODateString;
        readonly oa_locations: ReadonlyArray<Location>;
    }

    export interface Author {
        readonly family: string;
        readonly given: string;
    }

    export interface Location {
        readonly updated: ISODateTimeString;
        readonly is_best: boolean;
        readonly url_for_landing_page: URLStr;
        readonly url_for_pdf: URLStr;
    }

}
