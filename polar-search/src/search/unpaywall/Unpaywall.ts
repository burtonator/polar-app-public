import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DOIStr, URLStr} from "polar-shared/src/util/Strings";

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

    export interface Response extends Doc {
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
