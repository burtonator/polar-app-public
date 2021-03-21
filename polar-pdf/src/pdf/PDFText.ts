import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {PDFDocs} from "./PDFDocs";
import { ITextContent } from "./Types";

export class PDFText {

    public static async getText(docPathOrURL: PathOrURLStr,
                                callback: (pageNum: number, textContent: ITextContent) => void) {

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});

        const doc = await pdfLoadingTask.promise;

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
            const page = await doc.getPage(pageNum);
            const textContent = await page.getTextContent();
            callback(pageNum, textContent);
        }

    }

}


export interface PDFMeta {

}


