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
        var authors : string[] = []
        for (const metaInfo of Array.from(document.querySelectorAll("meta[name='citation_author']"))) {
            const author = metaInfo.getAttribute("content")
            if (author !== null) {
                authors.push(author)
            }
        }
        const sanitized = HTMLSanitizer.sanitizePortableDocument(readable.content);

        return {
            ...metadata,
            authors,
            excerpt: readable.excerpt,
            text: readable.textContent,
            content: sanitized
        }

    }

}
