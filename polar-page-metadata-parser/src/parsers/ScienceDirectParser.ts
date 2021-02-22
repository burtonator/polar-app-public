import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class ScienceDirectParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {

      const title = doc.querySelector("meta[name='citation_title']")?.getAttribute("content") || undefined

      const doi = "https://doi.org/" + doc.querySelector("meta[name='citation_doi']")?.getAttribute("content") || undefined

      const abstract = doc.querySelector("meta[property='og:description']")?.getAttribute("content") || undefined

      let authors : string[] = []

      for (const metaInfo of Array.from(doc.querySelectorAll("span.text.given-name"))) {
        const givenName = metaInfo.textContent
          if (givenName !== null) {
            authors.push(givenName)
          }
      }

      let authorIndex = 0 
      for (const metaInfo of Array.from(doc.querySelectorAll("span.text.surname"))) {
        const surname = metaInfo.textContent
          if (surname !== null) {
            authors[authorIndex] += " " + surname
            authorIndex++
          }
      }
      

      const date = doc.querySelector("meta[name='citation_publication_date']")?.getAttribute("content") || undefined

      const description = doc.querySelector("meta[property='og:description']")?.getAttribute("content") || undefined

      const publisher = "ScienceDirect"
      
      return {
          title,
          doi,
          abstract,
          authors,
          url: doc.location.href,
          date,
          description,
          publisher
      };

    }

}
