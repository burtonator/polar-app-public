import {FrontMatterParser} from "./FrontMatterParser";
import * as showdown from 'showdown';
import {HTMLStr} from "polar-shared/src/util/Strings";

export type MarkdownStr = string;

export type FrontMatter = { [key: string]: any };

export interface ParsedMarkdown {
    readonly html: HTMLStr;
    readonly front: FrontMatter;
}

export class MarkdownParser {

    public static parse(markdown: MarkdownStr): ParsedMarkdown {

        const converter = new showdown.Converter();

        const stripped = FrontMatterParser.strip(markdown);
        const html = converter.makeHtml(stripped);
        // const front: {[key: string]: any} = fm(markdown);

        const front = FrontMatterParser.parse(markdown);

        return {html, front: front};

    }

}
