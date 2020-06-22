import {Tabs} from "../chrome/Tabs";
import {CapturedContentEPUBGenerator} from "../captured/CapturedContentEPUBGenerator";
import {DatastoreWriter} from "../datastore/DatastoreWriter";
import {ReadabilityCapture} from "../ReadabilityCapture";
import ICapturedContent = ReadabilityCapture.ICapturedContent;
import WrittenDoc = DatastoreWriter.WrittenDoc;
import IWriteOpts = DatastoreWriter.IWriteOpts;
import {URLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {PDFMetadata} from "../../../polar-pdf/src/pdf/PDFMetadata";

export namespace SaveToPolarHandler {

    export interface ICapturedPDF {
        readonly url: URLStr;
    }

    export interface SaveToPolarMessage {
        readonly type: 'save-to-polar',
        readonly strategy: 'pdf' | 'capture';
        readonly value: ICapturedContent | ICapturedPDF;
    }

    async function saveToPolarAsPDF(capture: ICapturedPDF) {

        const blob = await URLs.toBlob(capture.url);

        // FIXME: move the function for handling PDF import into a central
        // class that works for THIS system or any system.
        const pdfMetadata = await PDFMetadata.getMetadata(capture.url);

        // FIXME: *all* the loaders (PDF and EPUB should all generally work
        // and do the same things so that we have standard doc handling.

    }

    function saveToPolar(capture: ICapturedContent) {

        console.log("Saving to Polar...");

        async function doLoadWrittenDoc(writtenDoc: WrittenDoc) {
            const url = 'https://beta.getpolarized.io/doc/' + writtenDoc.id;

            await Tabs.loadLinkInActiveTab(url);
            // document.location.href = url;
        }

        async function doAsync() {

            const epub = await CapturedContentEPUBGenerator.generate(capture);

            const doc = ArrayBuffers.toBlob(epub);

            const opts: IWriteOpts = {
                doc,
                type: 'epub',
                title: capture.title,
                description: capture.description,
                url: capture.url
            }

            const writtenDoc = await DatastoreWriter.write(opts)
            await doLoadWrittenDoc(writtenDoc);

        }

        // FIXME: report the error to the chrome extension...
        doAsync()
            .catch(err => console.error(err));

    }

    export function register() {

        chrome.runtime.onMessage.addListener((message) => {

            if (! message.type) {
                return;
            }

            switch (message.type) {

                case 'save-to-polar':
                    const capture = <ICapturedContent> message.value;
                    saveToPolar(capture)
                    break;

            }

        });

    }

}

