import {Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import PDFJS from 'pdfjs-dist';
import {DOIs} from './DOIs';
import {PathOrURLStr} from 'polar-shared/src/util/Strings';
import {URLs} from 'polar-shared/src/util/URLs';
import {PDFProps} from "./PDFProps";
import {StreamRangeFactory, Streams} from "polar-shared/src/util/Streams";

console.log("Running with pdf.js version: " + PDFJS.version);

// TODO: I'm not sure this is the safest way to find the worker path.
PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';

console.log("Running with GlobalWorkerOptions workerSrc: " + PDFJS.GlobalWorkerOptions.workerSrc);

export class PDFMetadata {

    /**
     * Return true if this is a
     *
     * @param streamRangeFactory
     */
    public static async isPDF(streamRangeFactory: StreamRangeFactory) {

        // TODO: we could have the range reader computed from the passed
        // datastructure type (file, URL, cloud storage, etc).

        const stream = streamRangeFactory(0, 4);
        const buff = await Streams.toBuffer(stream);

        const magic = buff.toString('utf-8');

        // https://en.wikipedia.org/wiki/List_of_file_signatures

        // hex:  25 50 44 46 2d
        // string: %PDF-

        return magic === '%PDF-';

    }

    public static async getMetadata(docPathOrURL: PathOrURLStr): Promise<PDFMeta> {

        const isPath = ! URLs.isURL(docPathOrURL);

        if (isPath && ! await Files.existsAsync(docPathOrURL)) {
            throw new Error("File does not exist at path: " + docPathOrURL);
        }

        const toURL = (input: string) => {

            if (URLs.isURL(input)) {
                return input;
            } else {
                return FilePaths.toURL(docPathOrURL);
            }

        };

        const docURL = toURL(docPathOrURL);

        const pdfLoadingTask = PDFJS.getDocument(docURL);
        const doc = await pdfLoadingTask.promise;

        const metaHolder = await doc.getMetadata();

        const filename = FilePaths.basename(docPathOrURL);
        let title: string | undefined;
        let description: string | undefined;
        let creator: string | undefined;
        let doi: string | undefined;
        let props: PDFProps = {};

        if (metaHolder.metadata) {

            const metadata = metaHolder.metadata;

            const toProps = () => {
                const result: PDFProps = {};

                const keys = Object.keys((<any> metadata)._metadata);

                for (const key of keys) {
                    result[key] = metadata.get(key);
                }

                return result;

            };

            props = toProps();

            title = Optional.of(metadata.get('dc:title')).getOrUndefined();
            description = Optional.of(metadata.get('dc:description')).getOrUndefined();
            creator = Optional.of(metadata.get('dc:creator')).getOrUndefined();
            doi = DOIs.toDOI(props);

        }

        return {
            fingerprint: doc.fingerprint,
            nrPages: doc.numPages,
            title,
            description,
            props,
            doi,
            creator
        };

    }

}


export interface PDFMeta {

    readonly fingerprint: string;

    readonly nrPages: number;

    readonly title?: string;

    readonly creator?: string;

    readonly description?: string;

    readonly doi?: string;

    /**
     * A link back to the page hosting the content.  This may not be the
     * original resource though and might be a page overview of the resource.
     *
     * This is often used with PDFs to have a 'meta' page for it.
     */
    readonly link?: string;

    /**
     * Full / raw list of metadata properties.
     */
    readonly props: Readonly<PDFProps>;

}


