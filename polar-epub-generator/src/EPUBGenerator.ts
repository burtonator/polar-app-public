export namespace EPUBGenerator {

    export function generate(doc: EPUBDocumentOptions) {

    }

    export type AuthorStr = string;

    export type URLStr = string;

    /**
     * ISO 2 char language code (defaults to en)
     */
    export type LangStr = string;

    /**
     * HTML string.
     */
    export type HTMLStr = string;

    export interface EPUBDocumentOptions {

        readonly title: string;

        readonly authors?: ReadonlyArray<AuthorStr>;

        readonly cover?: URLStr;

        readonly lang?: LangStr;

        readonly tocTitle?: string;

        readonly contents: ReadonlyArray<EPUBContent>;

    }

    export interface EPUBContent {

        readonly title: string;

        readonly authors?: ReadonlyArray<AuthorStr>;

        readonly data: HTMLStr;

        // excludeFromToc: optional, if is not shown on Table of content, default: false;
        // beforeToc: optional, if is shown before Table of content, such like copyright pages. default: false;
        // filename: optional, specify filename for each chapter, default: undefined;

    }

}


