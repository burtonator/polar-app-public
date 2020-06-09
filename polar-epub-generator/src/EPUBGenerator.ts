import JSZip from "jszip";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {TemplateLiterals} from "./TemplateLiterals";
import {Templates} from "./Templates";

export namespace EPUBGenerator {

    import IContent = TemplateLiterals.IContent;

    function renderContainerXML(): string {
        return TemplateLiterals.CONTAINER;
    }

    function renderContentOPF(doc: EPUBDocumentOptions) {

        const content: IContent = {

            title: doc.title,
            source: doc.url,
            lang: doc.lang || 'en',
            subjects: [],
            spine: [],
            manifest: [],
            guide: []

        }


        return Templates.render(TemplateLiterals.CONTENT_OPF)
    }

    /**
     *
     * Generate an EPUB and build the data into a zip buffer.
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

        */

        const zip = new JSZip();

        zip.file('/mimetype', 'application/epub+zip');
        zip.file('/META-INF/container.xml', renderContainerXML());

        const contents = withPath(doc.contents);

        for (const content of contents) {

            zip.file('OEBPS/'+ content.path, content.data);

            for (const image of content.images) {
                zip.file('OEBPS/' + image.path, image.data);
            }

        }

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

    function withPath(contents: ReadonlyArray<EPUBContent>): ReadonlyArray<EPUBContentWithPath> {

        return arrayStream(contents)
            .withIndex()
            .map((current, idx) => {
                return {
                    path: `chap-${idx}.html`,
                    ...current.value
                }
            })
            .collect();

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

        /**
         * URL representing this document.
         */
        readonly url: string;

        readonly title: string;

        readonly contents: ReadonlyArray<EPUBContent>;

        readonly authors?: ReadonlyArray<AuthorStr>;

        readonly cover?: RawData;

        readonly lang?: LangStr;

        readonly tocTitle?: string;


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

    interface EPUBContentWithPath extends EPUBContent {
        readonly path: string;
    }

}


