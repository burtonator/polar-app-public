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
        var authors : string[] = []
        for (const metaInfo of Array.from(document.querySelectorAll("meta[name='citation_author']"))) {
            const author = metaInfo.getAttribute("content")
            if (author !== null) {
                authors.push(author)
            }
        }
        const selection = extractSelection();
        const sanitized = HTMLSanitizer.sanitizePortableDocument(selection.outerHTML);
        const text = selection.innerText;


        return {
            ...metadata,
            authors,
            excerpt: metadata.description,
            text,
            content: sanitized
        }

    }

}
