import * as matter from 'gray-matter';
import {MarkdownStr} from "./MarkdownParser";

const graymatter = require('gray-matter');

export class FrontMatterParser {

    public static strip(data: string) {

        function removePrefix(data: string, marker: string) {
            const idx = data.indexOf(marker) + marker.length;
            return data.substring(idx);
        }

        data = removePrefix(data, "---\n");
        data = removePrefix(data, "---\n");
        return data;

    }

    public static parse(markdown: string) {
        type MatterConverter = (markdown: MarkdownStr) => matter.GrayMatterFile<string>;
        const matterConverter = <MatterConverter> <any> graymatter;
        const front = matterConverter(markdown);
        return front.data;
    }

}
