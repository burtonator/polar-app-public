
import * as PDFJS from 'pdfjs-dist';
import {
    DocumentInitParameters,
    PDFDocumentLoadingTask
} from "pdfjs-dist";
import {PDFWorkers} from "./PDFWorkers";
import {URLStr} from "polar-shared/src/util/Strings";

PDFJS.GlobalWorkerOptions.workerSrc = PDFWorkers.computeWorkerSrcPath();

/**
 * This code is bound/coupled to our webpack configuration whereby we always
 * copy the same path on every system we work with.
 */
export namespace PDFDocs {

    export interface Opts {
        readonly url: URLStr;
        readonly docBaseURL?: string;
    }

    /**
     * @typedef {Object} DocumentInitParameters
     * @property {string}     [url] - The URL of the PDF.
     * @property {TypedArray|Array|string} [data] - Binary PDF data. Use typed
     *    arrays (Uint8Array) to improve the memory usage. If PDF data is
     *    BASE64-encoded, use atob() to convert it to a binary string first.
     * @property {Object}     [httpHeaders] - Basic authentication headers.
     * @property {boolean}    [withCredentials] - Indicates whether or not
     *   cross-site Access-Control requests should be made using credentials such
     *   as cookies or authorization headers. The default is false.
     * @property {string}     [password] - For decrypting password-protected PDFs.
     * @property {TypedArray} [initialData] - A typed array with the first portion
     *   or all of the pdf data. Used by the extension since some data is already
     *   loaded before the switch to range requests.
     * @property {number}     [length] - The PDF file length. It's used for
     *   progress reports and range requests operations.
     * @property {PDFDataRangeTransport} [range]
     * @property {number}     [rangeChunkSize] - Specify maximum number of bytes
     *   fetched per range request. The default value is 2^16 = 65536.
     * @property {PDFWorker}  [worker] - The worker that will be used for
     *   the loading and parsing of the PDF data.
     * @property {number} [verbosity] - Controls the logging level; the
     *   constants from {VerbosityLevel} should be used.
     * @property {string} [docBaseUrl] - The base URL of the document,
     *   used when attempting to recover valid absolute URLs for annotations, and
     *   outline items, that (incorrectly) only specify relative URLs.
     * @property {string} [nativeImageDecoderSupport] - Strategy for
     *   decoding certain (simple) JPEG images in the browser. This is useful for
     *   environments without DOM image and canvas support, such as e.g. Node.js.
     *   Valid values are 'decode', 'display' or 'none'; where 'decode' is intended
     *   for browsers with full image/canvas support, 'display' for environments
     *   with limited image support through stubs (useful for SVG conversion),
     *   and 'none' where JPEG images will be decoded entirely by PDF.js.
     *   The default value is 'decode'.
     * @property {string} [cMapUrl] - The URL where the predefined
     *   Adobe CMaps are located. Include trailing slash.
     * @property {boolean} [cMapPacked] - Specifies if the Adobe CMaps are
     *   binary packed.
     * @property {Object} [CMapReaderFactory] - The factory that will be
     *   used when reading built-in CMap files. Providing a custom factory is useful
     *   for environments without `XMLHttpRequest` support, such as e.g. Node.js.
     *   The default value is {DOMCMapReaderFactory}.
     * @property {boolean} [stopAtErrors] - Reject certain promises, e.g.
     *   `getOperatorList`, `getTextContent`, and `RenderTask`, when the associated
     *   PDF data cannot be successfully parsed, instead of attempting to recover
     *   whatever possible of the data. The default value is `false`.
     * @property {number} [maxImageSize] - The maximum allowed image size
     *   in total pixels, i.e. width * height. Images above this value will not be
     *   rendered. Use -1 for no limit, which is also the default value.
     * @property {boolean} [isEvalSupported] - Determines if we can eval
     *   strings as JS. Primarily used to improve performance of font rendering,
     *   and when parsing PDF functions. The default value is `true`.
     * @property {boolean} [disableFontFace] - By default fonts are
     *   converted to OpenType fonts and loaded via font face rules. If disabled,
     *   fonts will be rendered using a built-in font renderer that constructs the
     *   glyphs with primitive path commands. The default value is `false`.
     * @property {boolean} [disableRange] - Disable range request loading
     *   of PDF files. When enabled, and if the server supports partial content
     *   requests, then the PDF will be fetched in chunks.
     *   The default value is `false`.
     * @property {boolean} [disableStream] - Disable streaming of PDF file
     *   data. By default PDF.js attempts to load PDFs in chunks.
     *   The default value is `false`.
     * @property {boolean} [disableAutoFetch] - Disable pre-fetching of PDF
     *   file data. When range requests are enabled PDF.js will automatically keep
     *   fetching more data even if it isn't needed to display the current page.
     *   The default value is `false`.
     *   NOTE: It is also necessary to disable streaming, see above,
     *         in order for disabling of pre-fetching to work correctly.
     * @property {boolean} [disableCreateObjectURL] - Disable the use of
     *   `URL.createObjectURL`, for compatibility with older browsers.
     *   The default value is `false`.
     * @property {boolean} [pdfBug] - Enables special hooks for debugging
     *   PDF.js (see `web/debugger.js`). The default value is `false`.
     * @param opts
     */
    export function getDocument(opts: Opts): PDFDocumentLoadingTask {

        const init: DocumentInitParameters = {
            ...opts,
            cMapPacked: true,
            cMapUrl: '/pdfjs-dist/cmaps/',
            disableAutoFetch: true,
            docBaseUrl: opts.docBaseURL
        };

        return PDFJS.getDocument(init);

    }

}
