import {search} from "../SearchEngine";
import {ISODateString, ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {URLStr} from "polar-shared/src/util/Strings";

const EMAIL = 'unpaywall@getpolarized.io';

export class UnpaywallSearchEngine implements search.Engine {

    public id: search.EngineIDStr = 'unpaywall';

    private readonly query: search.QueryStr;

    constructor(query: search.QueryStr) {
        this.query = query;
    }

    public async executeQuery(): Promise<search.Results> {

        // https://api.unpaywall.org/v2/10.1038/nature12373?email=YOUR_EMAIL
        const url = `api.unpaywall.org/v2/${this.query}?email=${EMAIL}`;

        const res = await fetch(url);

        const response: unpaywall.Response = await res.json();

        const entries = [this.toEntry(response)];
        const page: search.Page = {entries};
        return new search.SinglePageResults(page);

    }

    private toEntry(response: unpaywall.Response): search.Entry {

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

        const id = response.doi;
        const title = response.title;
        const doi = response.doi;
        const updated = response.updated;
        const published = response.published_date;

        const links = toLinks();

        return {
            id,
            title,
            updated,
            published,
            links,
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
