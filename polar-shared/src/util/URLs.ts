
import {PathOrURLStr, Strings, URLStr} from "./Strings";
import {ArrayBuffers} from "./ArrayBuffers";
import {Blobs} from "./Blobs";
import {Files} from "./Files";
import {BrowserContext, FilePaths} from "./FilePaths";
import { Logger } from "../logger/Logger";

const log = Logger.create();

export namespace URLs {

    interface CreateOpts {
        readonly base: URLStr;
        readonly params?: {[name: string]: string};
    }

    export function create(opts: CreateOpts): URLStr {

        const {params, base} = opts;

        const result = base.endsWith("?") ? base : base + "?";

        const query = Object.entries(params || {})
                            .map(current => current[0] + '=' + encodeURIComponent(current[1]))
                            .join("&")

        return result + query;

    }

    export async function toBuffer(url: URLStr): Promise<Buffer> {

        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await Blobs.toArrayBuffer(blob);
        return ArrayBuffers.toBuffer(arrayBuffer);

    }

    export async function toBlob(url: URLStr): Promise<Blob> {

        const response = await fetch(url);

        if (response.ok) {
            return await response.blob();
        } else {
            throw new Error(`Could not fetch URL: ${url} status: ${response.status}, statusText: '${response.statusText}'`);
        }

    }

    /**
     * Return true if the URL is a web scheme (http or https)
     * @param url
     */
    export function isWebScheme(url: URLStr) {
        return url.startsWith('http:') || url.startsWith('https:');
    }

    /**
     * Get the site base URL including the scheme, domain, and optionally the
     * port.
     */
    export function toBase(url: URLStr) {

        const parsedURL = new URL(url);

        const protocol = parsedURL.protocol;
        const hostname = parsedURL.hostname;
        const port = ! Strings.empty(parsedURL.port) ? `:${parsedURL.port}` : '';

        return `${protocol}//${hostname}${port}`;

    }

    export function absolute(url: string, base: string): string {

        // WARN: this is correct BUT for some reason it broke on google cloud
        // storage so I need to figure out why this is happening.

        // if (this.isURL(base)) {
        //     // this is already a URL and we dont' need to do anything to convert it.
        //     return base;
        // }

        try {
            return new URL(url, base).toString();
        } catch (e) {
            log.warn("Unable to convert URL to absolute: ", {url, base});
            throw e;
        }

    }

    /**
     * Return true if this is a URL
     */
    export function isURL(path: string) {

        if (path === null || path === undefined) {
            return false;
        }

        return path.startsWith("file:") ||
               path.startsWith("blob:") ||
               path.startsWith("http:") ||
               path.startsWith("https:");

    }

    /**
     * Return the path component of a URL.
     */
    export function pathname(url: string) {

        if (url.startsWith('/')) {
            // it's already a pathname
            return url;
        }

        if (url.startsWith('http://') || url.startsWith('https://')) {
            const prefixEnd = url.indexOf('://') + 3;
            const start = url.indexOf('/', prefixEnd);

            if (start === -1) {
                return "/";
            }

            return url.substring(start);
        }

        throw new Error("Unable to parse URL path: " + url);

    }

    export function basename(url: string, ext?: string) {

        const SEP = '/';

        const lastIndexOf = url.lastIndexOf(SEP);

        const result = lastIndexOf >= 0 ? url.substring(lastIndexOf + 1) : url;

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

    /**
     * Return true if the given URL exists by performing a HEAD request on it.
     */
    export async function existsWithHEAD(url: URLStr): Promise<boolean> {
        const response = await fetch(url, {method: 'HEAD'});
        return response.ok;
    }

    /**
     * Test if a file exists by performing a range request on it for zero bytes.
     */
    export async function existsWithGETUsingRange(url: URLStr): Promise<boolean> {

        const headers = {
            Range: "bytes=0-0"
        };

        const response = await fetch(url, {method: 'HEAD', headers});
        return response.ok;

    }

    export async function toURL(docPathOrURL: PathOrURLStr): Promise<URLStr> {

        const isPath = ! URLs.isURL(docPathOrURL);

        if (isPath && ! await Files.existsAsync(docPathOrURL)) {
            throw new Error("File does not exist at path: " + docPathOrURL);
        }

        if (URLs.isURL(docPathOrURL)) {
            return docPathOrURL;
        } else {
            return FilePaths.toURL(docPathOrURL);
        }

    }

}

