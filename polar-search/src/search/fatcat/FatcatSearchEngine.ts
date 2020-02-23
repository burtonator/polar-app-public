import {search} from "polar-search-api/src/api/search/Search";
import {ISODateYearString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Fetches} from "polar-shared/src/util/Fetch";
import {DOIStr} from "polar-shared/src/util/Strings";

/**
 * https://api.fatcat.wiki/v0/release/lookup?doi=10.1109/COMST.2018.2842460
 */
export class FatcatSearchEngine implements search.Engine {

    public static ID: search.SearchEngineID = 'fatcat';

    public id: search.EngineIDStr = FatcatSearchEngine.ID;

    constructor(private readonly request: search.Request) {
    }

    public async executeQuery(): Promise<search.Results> {

        const url = `https://api.fatcat.wiki/v0/release/lookup?doi=${this.request.q}&expand=files,filesets`;

        const res = await Fetches.fetch(url);

        const response: fatcat.Response = await res.json();

        return FatcatSearchEngine.handleResponse(response);

    }

    public static async handleResponse(response: fatcat.Response) {
        const entries = [this.toEntry(response)];
        return new search.SinglePageResults(entries);

    }

    private static toEntry(response: fatcat.Response): search.Entry {


        const toAuthors = (): ReadonlyArray<search.Author> => {

            return response.contribs.filter(current => current.role === 'author')
                                    .map(contrib => {

                const displayName = contrib.raw_name;

                return {
                    displayName,
                };

            });

        };

        const doi = response.ext_ids.doi;

        const id: string = doi || response.work_id;

        const title = response.title;
        // const published = response.published_date;
        const publisher = response.publisher;

        const published = response.release_year;

        // const links = toLinks();
        const authors = toAuthors();

        return {
            id,
            title,
            publisher,
            published,
            links: [],
            authors,
            doi
        };

    }

}

export namespace fatcat {

    // TODO: technically this is supposed to have files and filsets but I need to find an example.

    export interface Response {
        readonly publisher: string;
        readonly work_id: string;
        readonly container_id: string;
        readonly title: string;
        readonly contribs: ReadonlyArray<Contrib>;
        readonly ext_ids: ExtIDs;
        readonly release_year: ISODateYearString;
        readonly language: string;
        readonly volume: string;
        readonly pages: string;
    }

    export type ContribRole = 'author' | string;

    export interface Contrib {
        readonly raw_name: string;
        readonly role: ContribRole;
    }

    export interface ExtIDs {
        readonly doi?: DOIStr;
        readonly pmid?: string;
        readonly wikipedia_quid?: string;
    }

}
