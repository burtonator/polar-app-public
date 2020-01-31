import {URLStr} from "../util/Strings";

export interface AuthorImage {
    readonly src: URLStr;
}

export interface IAuthor {

    /**
     * The name of this author.
     */
    readonly name: string;

    readonly profileID: string;

    /**
     * The URL to this author's profile.
     */
    readonly url?: string;

    readonly image?: AuthorImage;

    /**
     * True if we're viewing this document as a guest and aren't the primary
     * owner which means we can't mutate it directly.
     */
    readonly guest?: boolean;

}
