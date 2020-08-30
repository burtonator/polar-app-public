import {PDFDocumentProxy} from "pdfjs-dist";
import {Strings} from "polar-shared/src/util/Strings";

export namespace PDFTitleExtractor {

    import TextItem = _pdfjs.TextItem;

    export async function extract(doc: PDFDocumentProxy): Promise<string | undefined> {

        if (doc.numPages === 0) {
            // no pages so we obviously can't extract a title.
            return undefined;
        }

        const page = await doc.getPage(1);
        const textContent = await page.getTextContent();

        if (textContent.items.length === 0 ) {
            // there actually isn't any text for us to work with.
            return undefined;
        }

        function computeTitleHeight() {
            const firstText = textContent.items[0];
            return firstText.height;
        }

        function computeHeadTextWithIdenticalHeight(height: number): ReadonlyArray<TextItem> {

            function createPredicate() {

                let accept: boolean = true;

                return (textItem: TextItem) => {

                    if (textItem.height !== height) {
                        accept = false;
                    }

                    return accept;

                }

            }

            return textContent.items.filter(createPredicate())

        }

        const titleHeight = computeTitleHeight();

        const head = computeHeadTextWithIdenticalHeight(titleHeight)

        if (head.length === 0) {
            return undefined;
        }

        return Strings.joinWithSpacing(head.map(current => current.str));

    }

}
