import {URLStr} from "polar-shared/src/util/Strings";
import { URLs } from "polar-shared/src/util/URLs";
import {Fetches} from "polar-shared/src/util/Fetch";
import ePub from "epubjs";

export namespace EPUBDocs {

    export interface Opts {
        readonly url: URLStr;
    }

    export async function getDocument(opts: Opts) {

        const docURL = await URLs.toURL(opts.url);

        async function toArrayBuffer() {
            // we have to convert the URL to an ArrayBuffer otherwise epub
            // gets confused and tries to load this incorrectly with epubs.
            //
            // TODO: we should have a progress listener here ...

            const response = await Fetches.fetch(docURL)
            return await response.arrayBuffer();
        }

        const arrayBuffer = await toArrayBuffer();
        return ePub(arrayBuffer);
    }

}