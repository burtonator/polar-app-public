import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class PubmedParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {

      const title = doc.querySelector("meta[name='citation_title']")?.getAttribute("content") || undefined

      const doi = doc.querySelector("a.id-link")?.getAttribute("href") || undefined

      const pmid = doc.querySelector("meta[name='citation_abstract_html_url']")?.getAttribute("content") || undefined

      var abstract = ""
      for (const paragraph of Array.from(doc.querySelectorAll("#abstract p"))) {
          abstract += paragraph.textContent?.trim()
      }

      var authors = doc.querySelector("meta[name='citation_authors']")?.getAttribute("content")?.split(";")

      const date = doc.querySelector("meta[name='citation_date']")?.getAttribute("content") || undefined

      const description = doc.querySelector("meta[property='og:description']")?.getAttribute("content") || undefined

      const publisher = "pubmed"
      
      return {
          title,
          doi,
          pmid,
          abstract,
          authors,
          url: doc.location.href,
          date,
          description,
          publisher
      };

    }

}
