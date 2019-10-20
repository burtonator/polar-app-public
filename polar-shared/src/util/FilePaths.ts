import * as libpath from 'path';
import * as os from 'os';
import {Optional} from './ts/Optional';
import {isPresent, Preconditions} from '../Preconditions';

/**
 * Work with file paths cross platform and work with the file separator using
 * the / char on Unix and the \ char on Windows.
 *
 * DO NOT call this for URI paths that are always / no matter what OS you are
 * on.
 */
export class FilePaths {

    /**
     * The OS specific file separator.
     */
    public static readonly SEP = libpath.sep;

    /**
     * Create a path from the given parts regardless of their structure.
     *
     * Don't allow double // or trailing /.  The output is always sane.
     *
     * @param dirname
     * @param basename
     */
    public static create(dirname: string, basename: string) {
        let result = this.join(dirname, basename);

        if (result.endsWith(libpath.sep)) {
            result = result.substring(0, result.length - 1);
        }

        return result;
    }

    /**
     * Join all arguments together and normalize the resulting path.
     *
     * Arguments must be strings. In v0.8, non-string arguments were silently
     * ignored. In v0.10 and up, an exception is thrown.
     *
     * @param paths paths to join.
     */
    public static join(...paths: string[]): string {
        return libpath.join(...paths);
    }

    /**
     * The right-most parameter is considered {to}.  Other parameters are
     * considered an array of {from}.
     *
     * Starting from leftmost {from} parameter, resolves {to} to an absolute
     * path.
     *
     * If {to} isn't already absolute, {from} arguments are prepended in right
     * to left order, until an absolute path is found. If after using all
     * {from} paths still no absolute path is found, the current working
     * directory is used as well. The resulting path is normalized, and
     * trailing slashes are removed unless the path gets resolved to the root
     * directory.
     *
     * @param pathSegments string paths to join.  Non-string arguments are
     *     ignored.
     */
    public static resolve(...pathSegments: string[]) {
        return libpath.resolve(...pathSegments);
    }

    /**
     * Return the last portion of a path. Similar to the Unix basename command.
     * Often used to extract the file name from a fully qualified path.
     *
     * Note that this behaves differently on Windows vs Linux.  The path
     * separator is changed and different values are returned for the platform.
     *
     * @param path the path to evaluate.
     * @param ext optionally, an extension to remove from the result.
     */
    public static basename(path: string, ext?: string) {

        if (libpath) {
            return libpath.basename(path, ext);
        } else {
            return BrowserFilePaths.basename(path, ext);
        }

    }

    public static dirname(path: string) {
        return libpath.dirname(path);
    }

    public static tmpdir() {
        return os.tmpdir();
    }

    /**
     * @deprecated use createTempName
     */
    public static tmpfile(name: string) {
        return this.join(os.tmpdir(), name);
    }

    /**
     * Create a named path entry in /tmp
     */
    public static createTempName(name: string) {
        return this.join(os.tmpdir(), name);
    }

    /**
     * Create a windows path from unix path.  Mostly used for testing.
     */
    public static toWindowsPath(path: string) {
        path = path.replace(/\//g, '\\' );
        return 'C:' + path;
    }

    /**
     * Find unix path strings in text and replace them with windows-like paths.
     *
     * Used for testing.
     */
    public static textToWindowsPath(text: string) {

        return text.replace(/(\/[a-zA-Z0-9_-]+)+(\/[a-zA-Z0-9_-]+\.[a-z]{2,3})/g, (substr: string) => {
            return this.toWindowsPath(substr);
        });

    }

    /**
     * If the file ends with .txt, .pdf, .html then return the extension.
     * @param path
     */
    public static toExtension(path: string): Optional<string> {

        if (! isPresent(path)) {
            return Optional.empty();
        }

        const matches = path.match(/\.([a-z0-9]{1,15})$/);

        if (matches && matches.length === 2) {
            return Optional.of(matches[1]);
        }

        return Optional.empty();

    }

    /**
     * Return true if the file has the the given extension.  Case insensitive.
     */
    public static hasExtension(path: string, ext: string) {
        Preconditions.assertPresent(path);
        Preconditions.assertPresent(ext);

        ext = ext.replace(/\.+/, "")
                 .toLowerCase();

        return path.toLowerCase().endsWith("." + ext);
    }

    /**
     * Convert this path to a file URL so that we can use it in an API that
     * expects a URL.
     */
    public static toURL(path: string) {

        // https://stackoverflow.com/questions/20619488/how-to-convert-local-file-path-to-a-file-url-safely-in-node-js

        // TODO: The new pathToFileURL function added in NodeJS 10.12 and
        // Electron 3.0.89 is on 10.2 at the time so we can't use this function
        // even though it's better.  We were using url.format which DOES work in
        // node but not from the renderer process for some reason.

        Preconditions.assertTypeOf(path, 'string', 'path');

        path = FilePaths.resolve(path);

        if (this.SEP === '\\') {

            // handle windows properly.

            // TODO: I actually think this is wrong as on Windows a file could
            // in theory have a forward slash

            path = path.replace(/\\/g, '/');

            // Windows drive letter must be prefixed with a slash
            if (path[0] !== '/') {
                path = '/' + path;
            }

        }

        return encodeURI('file://' + path);

    }

    public static fromURL(url: string) {

        if (! url.startsWith("file:")) {
            throw new Error("Not a file URL: " + url);
        }

        const parsedURL = new URL(url);

        // the URI pathname component is NOT decoded for us and we have to
        // do this manually otherwise we will have '%20' instead of ' ' and
        // other path encoding issues.
        const pathname = decodeURIComponent(parsedURL.pathname);

        // Replace the forward slash in the URL (which is safe because forward
        // slash is always the
        let path = pathname.replace(/\//g, this.SEP);

        if (this.SEP === '\\' && path.match(/^\\[C-Z]:/)) {

            // this is a windows file path and file URLs on windows look like
            //
            // file:///C:/path/to/file.txt
            //
            // and we just need to strip the first slash.

            path = path.substring(1);

        }

        return path;

    }

}

export class BrowserContext {

    public static separator() {
        const isWindows = ["Win32", "Win64"].includes(navigator.platform);
        return isWindows ? "\\" : "/";
    }

}

/**
 * Browser implementations of some functions in node.
 */
export class BrowserFilePaths {

    public static SEP =
        typeof navigator !== 'undefined' && navigator.platform ? BrowserContext.separator() : '/';

    /**
     *
     * @param path
     * @param ext
     * @param sep Use a specific separator when given (not determined by
     *     platform)
     */
    public static basename(path: string, ext?: string) {

        const lastIndexOf = path.lastIndexOf(this.SEP);

        const result = lastIndexOf >= 0 ? path.substring(lastIndexOf + 1) : path;

        if (ext) {

            if (result.endsWith(ext)) {
                return result.substring(0, result.length - ext.length);
            } else {
                return result;
            }

        } else {
            return result;
        }

    }

}
