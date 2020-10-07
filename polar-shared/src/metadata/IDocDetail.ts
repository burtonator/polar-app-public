
import {IAuthor} from "./IAuthor";
import {ISODateString, ISODateTimeString} from "./ISODateTimeStrings";
import {IDocAuthor} from "./IDocAuthor";
import {IText} from "./Text";
import {IImage} from "./IImage";
import {DOIStr, URLStr} from "../util/Strings";

export interface IJournal {
    readonly name: string;
    readonly openAccess?: boolean;
}

/**
 * Details about a document that was loaded which can be incorporated into
 * DocInfo if necessary.
 */
export interface IDocDetail {

    /**
     * The title for the document.
     */
    readonly title?: string;

    /**
     * The subtitle for the document.
     */
    readonly subtitle?: string;

    /**
     * The description for the document.
     */
    readonly description?: string;

    /**
     * The network URL for the document where we originally fetched it.  This is
     * the raw PDF, EPUB.
     */
    readonly url?: URLStr;

    /**
     * The web page, landing URL for this document which can be the original
     * URL if this is just HTML or a web page representing the doc.
     */
    readonly landingURL?: URLStr;

    /**
     * The number of pages in this document.
     */
    readonly nrPages?: number;

    readonly thumbnail?: IImage;

    readonly author?: IAuthor;

    readonly authors?: ReadonlyArray<IDocAuthor>;

    readonly published?: ISODateString | ISODateTimeString;

    readonly publisher?: string;

    readonly doi?: DOIStr;

    readonly doiURL?: string;

    readonly pmid?: string;

    readonly summary?: IText;

    readonly journal?: string | IJournal;

}

