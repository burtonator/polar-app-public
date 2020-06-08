
export = Readability;

declare class Readability {
    constructor(doc: Document, options?: Readability.Options);

    parse(): Readability.ParseResult;
    isProbablyReaderable(helperIsVisible?: (node: any) => boolean): boolean;
}

declare namespace Readability {
    interface Options {
        debug?: boolean;
        maxElemsToParse?: number;
        nbTopCandidates?: number;
        wordThreshold?: number;
        classesToPreserve?: string[];
    }

    interface ParseResult {
        title: string;
        byline: string;
        dir: string;
        content: string;
        textContent: string;
        length: number;
        excerpt: string;
    }
}
