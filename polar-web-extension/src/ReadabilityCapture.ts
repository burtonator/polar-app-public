import {HTMLSanitizer} from "polar-html/src/sanitize/HTMLSanitizer";
import Readability from "@polar-app/readability";
import {HTMLStr, PlainTextStr} from "polar-shared/src/util/Strings";
import {getMetadata, PageMetadata} from "page-metadata-parser";

export namespace ReadabilityCapture {

    export interface ICapturedContent extends PageMetadata {
        readonly content: HTMLStr;
        readonly text: PlainTextStr;
        readonly excerpt: PlainTextStr;
    }

    export function capture(): ICapturedContent {

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
