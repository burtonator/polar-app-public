import {Parser} from "../Parser";

export class ARXIVParser implements Parser {

    public parse(doc: Document): Metadata | undefined {
        const authors = doc.querySelectorAll(".authors .descriptor");
        // TODO: parse author data...

        return undefined;

    }

}
