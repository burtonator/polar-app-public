import {PathStr} from "polar-shared/src/util/Strings";
import {Files} from "polar-shared/src/util/Files";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {MarkdownParser} from "polar-markdown/src/MarkdownParser";
import {ReleaseMetadata} from "./ReleaseMetadatas";
import {Preconditions} from "polar-shared/src/Preconditions";

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

            function getFrontStr(key: string) {
                const value = <string> parsedMarkdown.front[key];
                return Preconditions.assertPresent(value, 'key missing: ' + key);
            }

            const release = getFrontStr('release');
            const date = getFrontStr('date');

            if (release) {
                result.push({
                    release,
                    html: parsedMarkdown.html,
                    date
                })
            }

        }

        return result;

    }

}
