import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class SimpleParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {

        const title = doc.querySelector(".title")?.textContent || undefined;

        const pdfURL = 'http://example.com/example.pdf'

        return {
            url: doc.location.href,
            title,
            pdfURL
        };

    }

}
