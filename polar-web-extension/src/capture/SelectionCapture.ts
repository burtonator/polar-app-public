import {HTMLSanitizer} from "polar-html/src/sanitize/HTMLSanitizer";
import {getMetadata,} from "page-metadata-parser";
import {ExtensionContentCapture} from "./ExtensionContentCapture";

export namespace SelectionCapture {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

    export function capture(): ICapturedEPUB {

        const url = document.location.href;

        function extractSelection() {
            const contents = window.getSelection()!.getRangeAt(0).cloneContents();

            const root = document.createElement('div');
            for (const child of Array.from(contents.childNodes)) {
                root.appendChild(child);
            }

            return root;
        }

        function parseMetadata() {
            return getMetadata(document, url);
        }

        const metadata = parseMetadata();
        const selection = extractSelection();
        const sanitized = HTMLSanitizer.sanitizePortableDocument(selection.outerHTML);
        const text = selection.innerText;


        return {
            ...metadata,
            excerpt: metadata.description,
            text,
            content: sanitized
        }

    }

}
