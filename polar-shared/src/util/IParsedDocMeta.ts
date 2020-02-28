
/**
 * Parsed metadata from a document.
 */
export interface IParsedDocMeta {

    readonly fingerprint: string;

    readonly nrPages: number;

    readonly title?: string;

    readonly creator?: string;

    readonly description?: string;

    readonly doi?: string;

    /**
     * A link back to the page hosting the content.  This may not be the
     * original resource though and might be a page overview of the resource.
     *
     * This is often used with PDFs to have a 'meta' page for it.
     */
    readonly link?: string;

    /**
     * Full / raw list of metadata properties.
     */
    readonly props: Readonly<DocProps>;

}


export interface DocProps {
    [key: string]: string;
}
