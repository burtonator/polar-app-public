import {HTMLSanitizer} from "polar-html/src/sanitize/HTMLSanitizer";
import Readability from "readability";
import {getMetadata} from "page-metadata-parser";
import {ExtensionContentCapture} from "./ExtensionContentCapture";

export namespace ReadabilityCapture {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

    export function capture(): ICapturedEPUB {

        const url = document.location.href;
        const doc = <Document> document.cloneNode(true);

        function parseReadability() {
            const readability = new Readability(doc);
            return readability.parse();
        }

        function parseMetadata() {
            return getMetadata(doc, url);
        }

        const readable = parseReadability();
        const metadata = parseMetadata();
        const sanitized = HTMLSanitizer.sanitizePortableDocument(readable.content);

        return {
            ...metadata,
            excerpt: readable.excerpt,
            text: readable.textContent,
            content: sanitized
        }

    }

}
