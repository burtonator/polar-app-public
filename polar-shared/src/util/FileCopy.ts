import {PathStr} from "./Strings";
import {Files} from "./Files";
import {FileExt, FileFinder} from "./FileFinder";
import {FilePaths} from "./FilePaths";

export class FileCopy {

    public static async copy(opts: FileCopyOpts) {
        await Files.createDirAsync(opts.dest);

        // FIXME: rework this so I pass in a set of sources rather than computing them so I can test this
        // code easier.
        const copySources = FileFinder.find(opts.src, {
            recurse: opts.recurse,
            extensions: opts.extensions
        });

        for (const copySource of copySources) {
            const dest = copySource.path;
            // FIXME: this is wrong as we have to remove the root dir, and then stick it
            // on to the target dir base

            // FIXME: rework this so that I return a list of instructions for the copy targets
            // not copying directly so that I can test this.

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
