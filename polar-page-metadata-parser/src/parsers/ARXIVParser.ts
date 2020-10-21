import {Parser} from "../Parser";
import {PageMetadata} from "../PageMetadata";

export class ARXIVParser implements Parser {

    public parse(doc: Document): PageMetadata | undefined {
        const authors = doc.querySelectorAll(".authors .descriptor");
        // TODO: parse author data...

        return undefined;

    }

}
