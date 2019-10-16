import {search} from "polar-search-api/src/api/search/Search";
import DOIStr = search.DOIStr;
import {SearchClient} from "./SearchClient";

export class DOILookup {

    public static async lookup(doi: DOIStr): Promise<search.Results> {

        return await SearchClient.exec({q: doi, target: 'unpaywall'})

    }

}