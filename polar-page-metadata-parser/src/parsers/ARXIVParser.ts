import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class ARXIVParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {
        // const authors = doc.querySelectorAll(".authors .descriptor");
        // TODO: parse author data...

        var url : string | null = null;
        var pdfURL : string | null = null;
        var title : string | null = null;
        var authors : string[] = [];
        var summary : string | null = null;

        for (const metaInfo of Array.from(doc.getElementsByTagName("meta"))) {
            if (metaInfo.attributes.length != 2) {
                continue;
            }

            if (metaInfo.attributes[0].nodeName == 'property' && metaInfo.attributes[0].nodeValue == 'og:url') {
                if (metaInfo.attributes[1].nodeName == 'content') {
                    url = metaInfo.attributes[1].nodeValue
                }
            }

            if (metaInfo.attributes[0].nodeName == 'name' && metaInfo.attributes[0].nodeValue == 'citation_pdf_url') {
                if (metaInfo.attributes[1].nodeName == 'content') {
                    pdfURL = metaInfo.attributes[1].nodeValue
                }
            }

            if (metaInfo.attributes[0].nodeName == 'name' && metaInfo.attributes[0].nodeValue == 'citation_title') {
                if (metaInfo.attributes[1].nodeName == 'content') {
                    title = metaInfo.attributes[1].nodeValue
                }
            }

            if (metaInfo.attributes[0].nodeName == 'name' && metaInfo.attributes[0].nodeValue == 'citation_author') {
                if (metaInfo.attributes[1].nodeName == 'content') {
                    if (metaInfo.attributes[1].nodeValue != null) {
                        authors.push(metaInfo.attributes[1].nodeValue)
                    }
                }
            }

            if (metaInfo.attributes[0].nodeName == 'property' && metaInfo.attributes[0].nodeValue == 'og:description') {
                if (metaInfo.attributes[1].nodeName == 'content') {
                    summary = metaInfo.attributes[1].nodeValue
                }
            }

        }

        if (url != null && pdfURL != null) {
            const result : PageMetadata = {
                url: url,
                pdfURL: pdfURL,
                title: title == null ? undefined : title,
                authors: authors.length == 0 ? undefined : authors,
                summary: summary == null ? undefined : summary
            };
            return result;
        }

        return undefined;

    }

}
