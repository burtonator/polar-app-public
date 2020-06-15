import {XHTMLWrapper} from "polar-epub-generator/src/XHTMLWrapper";
import {EPUBGenerator} from "polar-epub-generator/src/EPUBGenerator";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ReadabilityCapture} from "../ReadabilityCapture";
import {HTMLSanitizer} from "polar-html/src/sanitize/HTMLSanitizer";

export namespace CapturedContentEPUBGenerator {

    export async function generate(capture: ReadabilityCapture.ICapturedContent): Promise<ArrayBuffer> {

        const {title, url} = capture;

        // must call this to prevent XSS and also convert to well formed HTML
        const content = HTMLSanitizer.sanitize(capture.content);

        const data = XHTMLWrapper.wrap({title, content});

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
                    images: []
                }
            ]
        }

        return await EPUBGenerator.generate(doc);

    }

}
