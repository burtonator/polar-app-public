import {search} from "polar-search-api/src/api/search/Search";
import {Fetches, RequestInit} from "polar-shared/src/util/Fetch";

export class SearchClient {

    public static async exec(request: SearchRequest): Promise<search.Results> {

        const url = "https://us-central1-polar-cors.cloudfunctions.net/search";

        const body = JSON.stringify(request);

        const init: RequestInit = {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body
        };

        const response = await Fetches.fetch(url, init);

        if (response.status !== 200) {
            throw new Error("Request failed: " + response.status + ": " + response.statusText);
        }

        return await response.json();

    }

}

export interface SearchRequest extends search.Request {

    /**
     * The target engine to request.
     */
    readonly target: string;

}
