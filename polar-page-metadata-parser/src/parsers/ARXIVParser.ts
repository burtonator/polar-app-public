import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class ARXIVParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {

        const title = doc.querySelector("meta[name='citation_title']")?.getAttribute("content") || undefined

        const description = doc.querySelector("meta[property='og:description']")?.getAttribute("content") || undefined

        var authors : string[] = []

        for (const metaInfo of Array.from(doc.querySelectorAll("meta[name='citation_author']"))) {
            const author = metaInfo.getAttribute("content")
            if (author !== null) {
                authors.push(author)
            }
        }
        
        const pdfURL = doc.querySelector("meta[name='citation_pdf_url']")?.getAttribute("content") || undefined

        return {
            url: doc.location.href,
            title,
            description,
            authors,
            pdfURL
        };

    }

}
