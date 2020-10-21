import {PageMetadata} from "./PageMetadata";

/**
 * Main interface for parsing documents.  We would have a parser for ARXIV
 * named ARXIVParser, one for PubMed named PubMedParser, etc.
 */
export interface Parser {
    /**
     * Parse the document for metadata and return it to the caller.
     */
    readonly parse: (doc: Document) => PageMetadata | undefined;
}
