import JSZip from "jszip";

export namespace EPUBGenerator {

    /**
     *
     * @return ArrayBuffer Return an ArrayBuffer as we can convert this to either
     * a Blob for use in the browser or a Buffer for use in Node.
     */
    export async function generate(doc: EPUBDocumentOptions): Promise<ArrayBuffer> {

        /*
         Files I have to generate

         /mimetype

            which is just `application/epub+zip` without \n at the end

         /META-INF/container.xml

            Templates.CONTAINER

        /OEBPS/content.opf
        /OEBPS/toc.ncs

        FIXME:
            - how do we add images

        */

        const zip = new JSZip();

        zip.file('/mimetype', 'application/epub+zip');

        const options: JSZip.JSZipGeneratorOptions<'arraybuffer'> = {
            type: 'arraybuffer',
            streamFiles: true,
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        };

        return <ArrayBuffer> await zip.generateAsync(options);

    }

    export type AuthorStr = string;

    export type URLStr = string;

    /**
     * ISO 2 char language code (defaults to en)
     */
    export type LangStr = string;

    export type RawData = string | Uint8Array | ArrayBuffer | Blob;

    export type ImageData = RawData;

    export type HTMLData = RawData;

    interface EPUBImage {
        readonly path: string;
        readonly data: ImageData;
    }

    export interface EPUBDocumentOptions {

        readonly title: string;

        readonly authors?: ReadonlyArray<AuthorStr>;

        readonly cover?: RawData;

        readonly lang?: LangStr;

        readonly tocTitle?: string;

        readonly contents: ReadonlyArray<EPUBContent>;

    }

    export interface EPUBContent {

        readonly title: string;

        readonly authors?: ReadonlyArray<AuthorStr>;

        readonly data: HTMLData;

        /**
         * The images associated with this chapter.
         */
        readonly images: ReadonlyArray<EPUBImage>;

        // excludeFromToc: optional, if is not shown on Table of content, default: false;
        // beforeToc: optional, if is shown before Table of content, such like copyright pages. default: false;
        // filename: optional, specify filename for each chapter, default: undefined;

    }

}


