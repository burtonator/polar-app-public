import {PathStr} from "./Strings";
import {Files} from "./Files";
import {FileExt, FileFinder} from "./FileFinder";
import {FilePaths} from "./FilePaths";

export class FileCopy {

    public static async copy(opts: FileCopyOpts) {
        await Files.createDirAsync(opts.dest);

        const copySources = FileFinder.find(opts.src, {
            recurse: opts.recurse,
            extensions: opts.extensions
        });

        for (const copySource of copySources) {
            const dest = copySource.path;
            const destDir = FilePaths.dirname(dest);
            await Files.createDirAsync(destDir);
            await Files.copyFileAsync(copySource.path, dest);
        }

    }

}

export interface FileCopyOpts {

    readonly src: PathStr;

    readonly dest: PathStr;

    readonly recurse?: boolean;

    readonly extensions?: ReadonlyArray<FileExt>;

}
