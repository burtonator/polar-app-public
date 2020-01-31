import {UnpaywallSearchEngine} from "./unpaywall/UnpaywallSearchEngine";
import {ARXIVSearchEngine} from "./arxiv/ARXIVSearchEngine";
import {search} from "polar-search-api/src/api/search/Search";

export class Engines {

    public static create(id: search.SearchEngineID, request: search.Request): search.Engine {

        switch (id) {

            case UnpaywallSearchEngine.ID:
                return new UnpaywallSearchEngine(request);

            case ARXIVSearchEngine.ID:
                return new ARXIVSearchEngine(request);

            default:
                throw new Error("Unknown search engine: " + id);

        }

    }

}
