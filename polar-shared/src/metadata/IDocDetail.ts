
import {IAuthor} from "./IAuthor";
import {ISODateString, ISODateTimeString} from "./ISODateTimeStrings";
import {IDocAuthor} from "./IDocAuthor";
import {IText} from "./Text";
import {IImage} from "./IImage";

/**
 * Details about a document that was loaded which can be incorporated into
 * DocInfo if necessary.
 */
export interface IDocDetail {

    /**
     * A fingerprint for the document.
     */
    readonly fingerprint: string;

    /**
     * The title for the document.
     */
    readonly title?: string;

    readonly subtitle?: string;

    readonly description?: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    readonly url?: string;

    /**
     * The number of pages in this document.
     */
    readonly nrPages?: number;

    readonly thumbnail?: IImage;

    readonly author?: IAuthor;

    readonly authors?: ReadonlyArray<IDocAuthor>;

    readonly published?: ISODateString | ISODateTimeString;

    readonly publisher?: string;

    readonly doi?: string;

    readonly pmid?: string;

    readonly summary?: IText;

}
