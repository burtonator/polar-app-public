import * as libpath from "path";
import {PathStr} from "./Strings";
import * as fs from "fs";
import {FilePaths} from "./FilePaths";

/**
 * A bit like the 'find' in that we can recurse into files and fine sub-files.
 */
export class FileFinder {

    public static find(dir: string,
                       opts: Opts = new DefaultOpts()): ReadonlyArray<IFile> {

        const files = fs.readdirSync(dir);

        const result: IFile[] = [];

        for (const name of files) {

            const createType = (): FileType | undefined => {
                if (stat.isDirectory()) {
                    return 'directory';
                }

                if (stat.isFile()) {
                    return 'file';
                }

                return undefined;

            };

            const type = createType();

            if (! type) {
                continue;
            }

            const createRecord = (): IFile => {
                return {type, name, path};
            };

            const file = createRecord();

            const path = libpath.join(dir, name);

            const stat = fs.statSync(path);

            /**
             * Return true if we should accept the file.
             */
            const acceptFile = () => {

                const acceptExtension = () => {

                    if (! opts.extensions) {
                        return true;
                    }

                    const ext = FilePaths.toExtension(path).getOrUndefined();

                    return ext && opts.extensions.includes(ext);

                };

                const acceptType = () => {

                    if (! opts.types) {
                        return true;
                    }

                    return opts.types.includes(type);

                };

                return acceptExtension() && acceptType();

            };

            if (acceptFile()) {
                result.push(file);
            }

            if (opts.recurse && type === 'directory') {
                result.push(...this.find(path, opts));
            }

        }

        return result;

    }

}

export type FileType = 'file' | 'directory';

/**
 * A file extension without the '.' prefix.  Example: jpg, jpeg, txt
 */
export type FileExt = string;

class DefaultOpts implements Opts {
    public readonly recurse = true;
    public readonly types: ReadonlyArray<FileType> = ['file'];
}

export interface Opts {

    readonly recurse?: boolean;

    /**
     * Only accept the given file types.  By default all types are accepted.
     */
    readonly types?: ReadonlyArray<FileType>;

    /**
     * Only accept the given extensions.  By default all extension are accepted.
     */
    readonly extensions?: ReadonlyArray<FileExt>;

}

export interface IFile {


    readonly name: string;

    /**
     * The full path of the file.
     */
    readonly path: PathStr;

    /**
     * The type of the file.
     */
    readonly type: FileType;

}
