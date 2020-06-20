import {XHTMLWrapper} from "polar-epub-generator/src/XHTMLWrapper";
import {EPUBGenerator} from "polar-epub-generator/src/EPUBGenerator";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ReadabilityCapture} from "../ReadabilityCapture";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {URLs} from "polar-shared/src/util/URLs";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";
import { URLStr } from "polar-shared/src/util/Strings";

export namespace CapturedContentEPUBGenerator {

    interface LocalImage {
        readonly img: HTMLImageElement;
        readonly newHref: string;
        readonly blob: Blob;
    }

    async function toLocalImage(url: URLStr,
                                img: HTMLImageElement): Promise<LocalImage | undefined> {

        const href = img.getAttribute('href');

        if (! href) {
            return undefined;
        }

        // ID for the image...
        const id = Hashcodes.createRandomID();

        const basename = URLs.basename(href);
        const ext = FilePaths.toExtension(basename).getOrUndefined();
        const newHref = id + ext ? `.${ext}` : '';

        const hrefAbsolute = URLs.absolute(href, url);
        const blob = await URLs.toBlob(hrefAbsolute);

        return {
            img,
            newHref,
            blob
        };

    }

    function convertDocumentToLocalImages(localImages: ReadonlyArray<LocalImage>) {

        function convertHREFs() {

            // update the internal src href so that it can load from the epub
            // and not the original URL
            for (const localImage of localImages) {
                localImage.img.setAttribute('href', localImage.newHref);
            }

        }

        function toEPUBImage(local: LocalImage): EPUBGenerator.EPUBImage {
            return {
                href: local.newHref,
                data: local.blob
            };
        }

        convertHREFs();
        return localImages.map(toEPUBImage)

    }

    async function convertToEPUBDocument(capture: ReadabilityCapture.ICapturedContent) {

        const {title, url, content} = capture;

        const parser = new DOMParser();
        const contentDoc = parser.parseFromString(content, "text/html");

        const imgs = Array.from(contentDoc.querySelectorAll('img'));

        const localImages =
            await asyncStream(imgs)
             .map(current => toLocalImage(url, current))
             .filter(current => current !== undefined)
             .map(current => current!)
             .collect();

        const images = convertDocumentToLocalImages(localImages);

        const localContent = contentDoc.documentElement.outerHTML;
        const data = XHTMLWrapper.wrap({title, content: localContent});

        const doc: EPUBGenerator.EPUBDocument = {
            url,
            title,
            conversion: ISODateTimeStrings.create(),
            contents: [
                {
                    id: 'index.html',
                    href: 'index.html',
                    mediaType: 'application/xhtml+xml',
                    title,
                    data,
                    images
                }
            ]
        }

        return doc;

    }

    export async function generate(capture: ReadabilityCapture.ICapturedContent): Promise<ArrayBuffer> {
        const doc = await convertToEPUBDocument(capture);
        return await EPUBGenerator.generate(doc);
    }

}
