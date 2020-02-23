import {search} from "polar-search-api/src/api/search/Search";
import {SearchClient} from "./SearchClient";
import {DOIStr} from "polar-shared/src/util/Strings";

/**
 * Lookup the metadata and download URL for a specific DOU
 */
export class DOILookup {

    public static async lookup(doi: DOIStr): Promise<search.Results> {

        // TODO: fatcat supports DOI too just not always the download URL.
        return await SearchClient.exec({q: doi, target: 'unpaywall'});

    }

}
