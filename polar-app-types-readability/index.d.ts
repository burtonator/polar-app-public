declare module '@polar-app/readability' {

    class Readability {

        constructor(doc: Document, options?: Options);

        parse(): ParseResult;

        isProbablyReaderable(helperIsVisible?: (node: any) => boolean): boolean;

    }

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
