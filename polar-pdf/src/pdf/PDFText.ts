import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {TextContent} from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";

export class PDFText {

    public static async getText(docPathOrURL: PathOrURLStr,
                                callback: (page: number, textContent: TextContent) => void) {

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});

        const doc = await pdfLoadingTask.promise;

        for (let idx = 1; idx <= doc.numPages; idx++) {
            const page = await doc.getPage(idx);
            const textContent = await page.getTextContent();
            callback(idx, textContent);
        }

    }

}


export interface PDFMeta {

}


