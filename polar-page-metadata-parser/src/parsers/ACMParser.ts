import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class ACMParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {

      const title = doc.querySelector("meta[name='dc.Title']")?.getAttribute("content") || undefined

      const doi = "https://doi.org/" + doc.querySelector("meta[scheme='doi']")?.getAttribute("content") || undefined

      const abstract = doc.querySelector("meta[name='dc.Description']")?.getAttribute("content") || undefined

      let authors : string[] = []

      for (const metaInfo of Array.from(doc.querySelectorAll(".author-name"))) {
        const name = metaInfo.getAttribute("title")
          if (name !== null) {
            authors.push(name)
          }
      }

      const pdfURL = "https://dl.acm.org" + doc.querySelector(".pdf-file a")?.getAttribute("href") || undefined

      const date = doc.querySelector("meta[name='dc.Date']")?.getAttribute("content") || undefined

      const description = doc.querySelector("meta[name='Description']")?.getAttribute("content") || undefined

      const publisher = "ACM"
      
      return {
          title,
          doi,
          abstract,
          authors,
          url: doc.location.href,
          pdfURL,
          date,
          description,
          publisher
      };

    }

}
