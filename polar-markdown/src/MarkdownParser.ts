
import * as showdown from 'showdown';
import * as matter from 'gray-matter';
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

        const html = converter.makeHtml(markdown);
        // const front: {[key: string]: any} = fm(markdown);

        const front = matter.read(markdown);

        return {html, front: front.data};

    }

}
