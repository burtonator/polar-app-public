import {DOIStr, URLStr} from "polar-shared/src/util/Strings";
import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Files} from "polar-shared/src/util/Files";
import {DocPreviews, DocPreviewUncached} from "./DocPreviews";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ArrayStreams} from "polar-shared/src/util/ArrayStreams";

const LIMIT = 100;

function getPath() {

    if (process.argv.length !== 3) {
        const command = process.argv[1];
        console.error(`SYNTAX ${command} [path]`);
        process.exit(1);
    }

    return process.argv[2];
}

export class DocPreviewsLoader {

    public static async load() {

        const path = getPath();

        const data = await Files.readFileAsync(path);
        const content = data.toString('utf-8');

        const lines = ArrayStreams.create(content.split("\n"))
                                  .filter(line => line.trim() !== '')
                                  .head(LIMIT)
                                  .collect();

        for (const line of lines) {

            const doc: Unpaywall.Doc = JSON.parse(line);

            // TODO: authors

            const url = doc.oa_locations[0].url_for_pdf;
            const urlHash = Hashcodes.create(url);

            const docPreview: DocPreviewUncached = {
                cached: false,
                url,
                urlHash,
                landingURL: doc.oa_locations[0].url_for_landing_page,
                title: doc.title,
                published: doc.published_date,
                publisher: doc.publisher || undefined,
                doi: doc.doi,
                doiURL: doc.doi_url,
            };

            await DocPreviews.set(docPreview);

        }

    }

}


export namespace Unpaywall {

    export interface Doc {
        readonly doi: DOIStr;
        readonly doi_url: URLStr;
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
