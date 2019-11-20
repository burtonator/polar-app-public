import {VersionStr} from "polar-shared/src/util/Version";
import {HTMLStr, PathStr} from "polar-shared/src/util/Strings";
import {Files} from "polar-shared/src/util/Files";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {MarkdownParser} from "./MarkdownParser";

export interface ReleaseMetadata {
    readonly release: VersionStr;
    readonly html: HTMLStr;
}

export class ReleaseMetadataParser {

    public static async parse(dir: PathStr): Promise<ReadonlyArray<ReleaseMetadata>> {

        const computeMarkdownFiles = async () => {
            const files = await Files.readdirAsync(dir);

            return files.filter(file => file.endsWith(".md"))
                   .map(file => FilePaths.join(dir, file));
        };

        const result: ReleaseMetadata[] = [];

        const markdownFiles = await computeMarkdownFiles();

        for (const markdownFile of markdownFiles) {
            const markdown = await Files.readFileAsync(markdownFile);
            const parsedMarkdown = MarkdownParser.parse(markdown.toString('utf-8'));

            const release = <string> parsedMarkdown.front['release'];
            if (release) {
                result.push({
                    release,
                    html: parsedMarkdown.html
                })
            }

        }

        return result;

    }

}
