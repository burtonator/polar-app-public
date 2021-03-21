
export type TTransform = number[];

export type TTextDirection = "ttb" | "ltr" | "rtl";

export interface ITextItem {

    str: string;
    dir: TTextDirection;
    transform: TTransform;
    width: number;
    height: number;
    fontName: string;

}

export interface ITextStyles {
    ascent: number;
    descent: number;
    vertical?: boolean;
    fontFamily: string;
}

export interface ITextContent {
    items: ITextItem[];
    styles: { [fontName: string]: ITextStyles };
}

export interface IDocumentInitParameters {
    url?: string;
    data?: Uint8Array | ArrayLike<number> | ArrayBufferLike | string;
    headers?: Headers;
    withCredentials?: boolean;
    password?: string;
    initialData?: Uint8Array;
    length?: number;
    // range?: PDFDataRangeTransport;
    rangeChunkSize?: number;
    // worker?: PDFWorker;
    postMessageTransfers?: boolean;
    // verbosity?: VerbosityLevel;
    docBaseUrl?: string;
    // nativeImageDecoderSupport?: NativeImageDecoding;
    cMapUrl?: string;
    cMapPacked?: boolean;
    // CMapReaderFactory?: CMapReaderFactory;
    stopAtErrors?: boolean;
    maxImageSize?: number;
    isEvalSupported?: boolean;
    disableFontFace?: boolean;
    disableRange?: boolean;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
    disableCreateObjectURL?: boolean;
    pdfBug?: boolean;
}

export type passwordCallback = (
    newPassword: (password: string) => void,
    reason: PasswordResponses
) => void;

/**

 * PDF document loading operation.
 * @class
 * @alias PDFDocumentLoadingTask
 */
export interface IPDFDocumentLoadingTask {
    /**
     * Unique document loading task id -- used in MessageHandlers.
     * @type {string}
     */
    docId: string;

    /**
     * Shows if loading task is destroyed.
     * @type {boolean}
     */
    destroyed: boolean;

    /**
     * Callback to request a password if wrong or no password was provided.
     * The callback receives two parameters: function that needs to be called
     * with new password and reason (see {PasswordResponses}).
     */
    onPassword: passwordCallback | null;

    /**
     * Callback to be able to monitor the loading progress of the PDF file
     * (necessary to implement e.g. a loading bar). The callback receives
     * an {Object} with the properties: {number} loaded and {number} total.
     */
    onProgress: documentLoadingProgressCallback | null;

    /**
     * Callback to when unsupported feature is used. The callback receives
     * an {UNSUPPORTED_FEATURES} argument.
     */
    onUnsupportedFeature: unsupportedFeatureCallback | null;

    /**
     * @type {Promise<PDFDocumentProxy>}
     */
    promise: Promise<PDFDocumentProxy>;

    /**
     * Aborts all network requests and destroys worker.
     * @return {Promise} A promise that is resolved after destruction activity
     *                   is completed.
     */
    destroy(): Promise<void>;

    /**
     * Registers callbacks to indicate the document loading completion.
     *
     * @param {function} onFulfilled The callback for the loading completion.
     * @param {function} onRejected The callback for the loading failure.
     * @return {Promise} A promise that is resolved after the onFulfilled or
     *                   onRejected callback.
     */
    then<R1, R2>(
        onFulfilled?: (value?: PDFDocumentProxy) => R1 | PromiseLike<R1>,
        onRejected?: (reason?: Error) => R2 | PromiseLike<R2>
    ): Promise<R1 | R2>;
}
