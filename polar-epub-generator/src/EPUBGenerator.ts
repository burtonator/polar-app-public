import JSZip from "jszip";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDStr} from "polar-shared/src/util/Strings";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {TOC_HTML} from "./templates/TOC_HTML";
import {ContainerXML} from "./templates/ContainerXML";
import {ContainerOPF} from "./templates/ContainerOPF";
import {TOC_NCX} from "./templates/TOC_NCX";

export namespace EPUBGenerator {

    import ISpineItem = ContainerOPF.ISpineItem;
    import IManifestItem = ContainerOPF.IManifestItem;
    import IGuideReference = ContainerOPF.IGuideReference;
    import IContent = ContainerOPF.IContent;
    import ITOC = TOC_NCX.ITOC;
    import IPage = TOC_NCX.IPage;
    export type AuthorStr = string;

    export type URLStr = string;

    /**
     * ISO 2 char language code (defaults to en)
     */
    export type LangStr = string;

    export type RawData = string | Uint8Array | ArrayBuffer | Blob;

    export type ImageData = RawData;

    export type HTMLData = RawData;

    export type MediaType = 'application/xhtml+xml' | 'image/png' | 'image/jpeg' | 'image/svg+xml' | 'image/gif' | 'image/webp';

    export interface EPUBImage {

        /**
         * A unique id for the image.
         */
        readonly id: string;

        /**
         * The src href of the image that we're writing...
         */
        readonly src: string;

        /**
         * The image data
         */
        readonly data: ImageData;

        /**
         * The media type of the image. Example: image/png, image/svg+xml, etc
         */
        readonly mediaType: MediaType;
    }

    export interface EPUBDocument {

        /**
         * URL representing this document.c
         */
        readonly url: string;

        readonly title: string;

        readonly contents: ReadonlyArray<EPUBContent>;

        readonly creator?: string;

        readonly authors?: ReadonlyArray<AuthorStr>;

        readonly cover?: RawData;

        readonly lang?: LangStr;

        readonly tocTitle?: string;

        /**
         * The time the document was published.
         */
        readonly publication?: ISODateTimeString | ISODateString;

        readonly conversion: ISODateTimeString | ISODateString;

    }

    export interface EPUBContent {

        readonly id: IDStr;

        readonly href: URLPathStr;

        readonly mediaType: MediaType;

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

    export function renderContainerXML(): string {
        return ContainerXML.generate();
    }

    export function renderContentOPF(doc: EPUBDocument) {

        function toSpine(): ReadonlyArray<ISpineItem> {

            function toSpineItem(content: EPUBContent): ISpineItem {

                return {
                    idref: content.id,
                    linear: 'yes'
                };

            }

            return doc.contents.map(toSpineItem);

        }

        function toManifest(): ReadonlyArray<IManifestItem> {

            function contentsToManifest(): ReadonlyArray<IManifestItem> {

                function toManifestItem(content: EPUBContent): IManifestItem {

                    return {
                        id: content.id,
                        href: content.href,
                        mediaType: content.mediaType
                    };

                }

                return doc.contents.map(toManifestItem);

            }

            function imagesToManifest(): ReadonlyArray<IManifestItem> {

                function toManifestItem(image: EPUBImage): IManifestItem {

                    return {
                        id: image.id,
                        href: image.src,
                        mediaType: image.mediaType
                    };

                }

                return arrayStream(doc.contents)
                        .flatMap(content => content.images)
                        .map(toManifestItem)
                        .collect();

            }

            function guideToManifest(): ReadonlyArray<IManifestItem> {
                return [
                    {
                        id: 'toc.html',
                        href: 'toc.html',
                        mediaType: "application/xhtml+xml"
                    }
                ]
            }


            return [
                ...contentsToManifest(),
                ...imagesToManifest(),
                ...guideToManifest()
            ];

        }

        function toGuide(): ReadonlyArray<IGuideReference> {

            return [
                {
                    type: 'toc',
                    title: "Table of Contents",
                    href: 'toc.html'
                }
            ]

        }


        const spine = toSpine();
        const manifest = toManifest();
        const guide = toGuide();

        const content: IContent = {
            id: doc.url,
            title: doc.title,
            source: doc.url,

            creator: doc.creator,
            lang: doc.lang || 'en',

            // we don't need this now as there aren't many subjects there.
            subjects: [],
            publication: doc.publication,
            conversion: doc.conversion,

            spine,
            manifest,
            guide

        }

        return ContainerOPF.generate(content);

    }

    export function renderTOCNCX(doc: EPUBDocument) {

        function toPages(): ReadonlyArray<IPage> {

            function toPage(content: EPUBContent, idx: number): IPage {

                return {
                    playOrder: idx + 1,
                    label: content.title,
                    src: content.href
                };

            }
            return doc.contents.map(toPage);

        }

        const pages = toPages();

        const content: ITOC = {
            uid: doc.url,
            title: doc.title,
            totalPageCount: doc.contents.length,
            maxPageNumber: doc.contents.length,
            pages
        }

        return TOC_NCX.generate(content);

    }

    export function renderTOCHTML(doc: EPUBDocument) {

        function toLinks(): ReadonlyArray<TOC_HTML.ILink> {

            function toLink(content: EPUBContent, idx: number): TOC_HTML.ILink {

                return {
                    href: content.href,
                    title: content.title
                };

            }
            return doc.contents.map(toLink);

        }

        const links = toLinks();

        const toc: TOC_HTML.TOC = {
            title: "Table of Contents",
            links
        }

        return TOC_HTML.generate(toc);

    }


    /**
     *
     * Generate an EPUB and build the data into a zip buffer.
     *
     * @return ArrayBuffer Return an ArrayBuffer as we can convert this to either
     * a Blob for use in the browser or a Buffer for use in Node.
     */
    export async function generate(doc: EPUBDocument): Promise<ArrayBuffer> {

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

        function writeControlFiles() {
            zip.file('mimetype', 'application/epub+zip', {compression: "STORE"});
            zip.file('META-INF/container.xml', renderContainerXML());
            zip.file('OEBPS/content.opf', renderContentOPF(doc));
            zip.file('OEBPS/toc.ncx', renderTOCNCX(doc));
            zip.file('OEBPS/toc.html', renderTOCHTML(doc));
        }

        function writeContents() {
            const contents = withPath(doc.contents);

            for (const content of contents) {

                zip.file('OEBPS/'+ content.href, content.data);

                for (const image of content.images) {
                    zip.file('OEBPS/' + image.src, image.data);
                }

            }
        }

        async function toArrayBuffer() {

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

        writeControlFiles();
        writeContents();

        return await toArrayBuffer();

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

}


