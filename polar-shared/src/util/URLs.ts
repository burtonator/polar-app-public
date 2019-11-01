
import {PathOrURLStr, Strings, URLStr} from "./Strings";
import {ArrayBuffers} from "./ArrayBuffers";
import {Blobs} from "./Blobs";
import {Files} from "./Files";
import {FilePaths} from "./FilePaths";

export class URLs {

    public static async toBuffer(url: URLStr): Promise<Buffer> {

        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await Blobs.toArrayBuffer(blob);
        return ArrayBuffers.toBuffer(arrayBuffer);

    }

    public static async toBlob(url: URLStr): Promise<Blob> {

        const response = await fetch(url);

        if (response.ok) {
            return await response.blob();
        } else {
            throw new Error(`Could not fetch URL ${response.status}: ${response.statusText}`);
        }

    }

    /**
     * Return true if the URL is a web scheme (http or https)
     * @param url
     */
    public static isWebScheme(url: URLStr) {

        return url.startsWith('http:') || url.startsWith('https:');

    }

    /**
     * Get the site base URL including the scheme, domain, and optionally the
     * port.
     */
    public static toBase(url: URLStr) {

        const parsedURL = new URL(url);

        const protocol = parsedURL.protocol;
        const hostname = parsedURL.hostname;
        const port = ! Strings.empty(parsedURL.port) ? `:${parsedURL.port}` : '';

        return `${protocol}//${hostname}${port}`;

    }

    public static absolute(url: string, base: string): string {

        // if (this.isURL(base)) {
        //     // this is already a URL.
        //     return base;
        // }

        return new URL(url, base).toString();
    }

    /**
     * Return true if this is a URL
     */
    public static isURL(path: string) {

        if (!path) {
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
    public static pathname(url: string) {

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

    /**
     * Return true if the given URL exists by performing a HEAD request on it.
     */
    public static async existsWithHEAD(url: URLStr): Promise<boolean> {
        const response = await fetch(url, {method: 'HEAD'});
        return response.ok;
    }

    /**
     * Test if a file exists by performing a range request on it for zero bytes.
     */
    public static async existsWithGETUsingRange(url: URLStr): Promise<boolean> {

        const headers = {
            Range: "bytes=0-0"
        };

        const response = await fetch(url, {method: 'HEAD', headers});
        return response.ok;

    }

    public static async toURL(docPathOrURL: PathOrURLStr): Promise<URLStr> {

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

