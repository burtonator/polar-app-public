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
                return <string> parsedMarkdown.front[key] || undefined;
            }

            const release = getFrontStr('release');
            const date = getFrontStr('date');

            if (! release || ! date) {
                // TODO: use filters to process these in the future.
                continue;
            }

            const title = Preconditions.assertPresent(getFrontStr('title'), 'title');
            // tslint:disable-next-line:variable-name
            const video_embed = getFrontStr('video_embed');
            // tslint:disable-next-line:variable-name
            const large_image = getFrontStr('large_image');


            if (release) {
                const id = release;
                result.push({
                    id, date, title, large_image, video_embed, release,
                    html: parsedMarkdown.html,
                });
            }

        }

        return result;

    }

}
