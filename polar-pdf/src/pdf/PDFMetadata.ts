import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DOIs} from './DOIs';
import {PathOrURLStr} from 'polar-shared/src/util/Strings';
import {URLs} from 'polar-shared/src/util/URLs';
import {PDFProps} from "./PDFProps";
import {StreamRangeFactory, Streams} from "polar-shared/src/util/Streams";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import {PDFDocs} from "./PDFDocs";
import { IDimensions } from 'polar-shared/src/util/IDimensions';
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";

export namespace PDFMetadata {

    export interface IPDFPageInfo {

        /**
         * The page number for this page.
         */
        readonly num: PageNumber;

        /**
         * The native viewport dimensions of this page.
         */
        readonly dimensions: IDimensions;

    }

    /**
     * Index of the page number and the dimensions.
     */
    export type PDFPageInfoIndex = {[pageNum: number]: IPDFPageInfo};

    export interface IPDFParsedDocMeta extends IParsedDocMeta {
        readonly pageInfoIndex: Readonly<PDFPageInfoIndex>;
    }

    /**
     * Return true if this is a PDF
     */
   export async function isPDF(streamRangeFactory: StreamRangeFactory) {

        // TODO: we could have the range reader computed from the passed
        // data structure type (file, URL, cloud storage, etc).

        const stream = streamRangeFactory(0, 4);
        const buff = await Streams.toBuffer(stream);

        const magic = buff.toString('utf-8');

        // https://en.wikipedia.org/wiki/List_of_file_signatures

        // hex:  25 50 44 46 2d
        // string: %PDF-

        return magic === '%PDF-';

    }

    export async function getMetadata(docPathOrURL: PathOrURLStr): Promise<IPDFParsedDocMeta> {

        const isPath = ! URLs.isURL(docPathOrURL);

        // if (isPath) {
        //     console.log("Loading metadata from file path: " + docPathOrURL);
        //
        //     if (isPath && ! await Files.existsAsync(docPathOrURL)) {
        //         throw new Error("File does not exist at path: " + docPathOrURL);
        //     }
        //
        // }

        const toURL = (input: string) => {

            if (URLs.isURL(input)) {
                return input;
            } else {
                return FilePaths.toURL(docPathOrURL);
            }

        };

        const docURL = toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});
        const doc = await pdfLoadingTask.promise;

        // FIXME: get the viewport for each page in the native viewport height
        // and adjust it to the browser viewport/size

        async function computePDFPageInfoIndex(): Promise<Readonly<PDFPageInfoIndex>> {

            const result: PDFPageInfoIndex = {};

            for (let pageNum = 1; pageNum <= doc.numPages; ++pageNum) {
                const page = await doc.getPage(pageNum);
                const viewport = page.getViewport({scale: 1});
                const width = viewport.width;
                const height = viewport.height;

                const pageInfo: IPDFPageInfo = {
                    num: pageNum,
                    dimensions: {
                        width, height
                    }
                }

                result[pageNum] = pageInfo;

            }

            return result;

        }

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

                const anyMetadata = <any> metadata;

                // TODO: on PDFJS 2.4 it's _metadataMap
                const keys = Object.keys(anyMetadata._metadata || anyMetadata._metadataMap);

                for (const key of keys) {
                    const value = metadata.get(key);

                    if (value) {
                        result[key] = value;
                    }

                }

                return result;

            };

            props = toProps();

            title = Optional.of(metadata.get('dc:title')).getOrUndefined();
            description = Optional.of(metadata.get('dc:description')).getOrUndefined();
            creator = Optional.of(metadata.get('dc:creator')).getOrUndefined();
            doi = DOIs.toDOI(props);

        }

        const pageInfoIndex = await computePDFPageInfoIndex();

        return {
            fingerprint: doc.fingerprint,
            nrPages: doc.numPages,
            title,
            description,
            props,
            doi,
            creator,
            pageInfoIndex
        };

    }

}

