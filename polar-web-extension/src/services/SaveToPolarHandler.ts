import {Tabs} from "../chrome/Tabs";
import {CapturedContentEPUBGenerator} from "../captured/CapturedContentEPUBGenerator";
import {DatastoreWriter} from "../datastore/DatastoreWriter";
import {ReadabilityCapture} from "../ReadabilityCapture";
import {URLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import WrittenDoc = DatastoreWriter.WrittenDoc;
import IWriteOpts = DatastoreWriter.IWriteOpts;

export namespace SaveToPolarHandler {

    import ICapturedEPUB = ReadabilityCapture.ICapturedEPUB;

    export interface ICapturedPDF {
        readonly url: URLStr;
    }

    export type SaveToPolarRequest = SaveToPolarRequestWithEPUB | SaveToPolarRequestWithPDF;

    export interface SaveToPolarRequestWithEPUB {
        readonly type: 'save-to-polar',
        readonly strategy: 'epub';
        readonly value: ICapturedEPUB;
    }

    export interface SaveToPolarRequestWithPDF {
        readonly type: 'save-to-polar',
        readonly strategy: 'pdf';
        readonly value: ICapturedPDF;
    }


    async function doLoadWrittenDoc(writtenDoc: WrittenDoc) {
        const url = 'https://beta.getpolarized.io/doc/' + writtenDoc.id;
        await Tabs.loadLinkInActiveTab(url);
    }

    function saveToPolarAsPDF(capture: ICapturedPDF) {

        console.log("saveToPolarAsPDF")

        async function doAsync() {
            const blob = await URLs.toBlob(capture.url);
            const basename = URLs.basename(capture.url);

            const opts: IWriteOpts = {
                doc: blob,
                type: 'pdf',
                basename,
                url: capture.url
            }

            const writtenDoc = await DatastoreWriter.write(opts)
            await doLoadWrittenDoc(writtenDoc);

        }

        // FIXME: report the error to the chrome extension...
        doAsync()
            .catch(err => console.error(err));

    }

    function saveToPolarAsEPUB(capture: ICapturedEPUB) {

        console.log("saveToPolarAsEPUB")

        async function doAsync() {

            const epub = await CapturedContentEPUBGenerator.generate(capture);

            const doc = ArrayBuffers.toBlob(epub);

            const basename = Hashcodes.createRandomID() + '.' + 'epub';

            const opts: IWriteOpts = {
                doc,
                type: 'epub',
                title: capture.title,
                description: capture.description,
                url: capture.url,
                basename
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
                console.warn("No message type: ", message)
                return;
            }

            switch (message.type) {

                case 'save-to-polar':

                    console.log("Handling save-to-polar message: ", message);

                    const request = <SaveToPolarRequest> message;

                    switch (request.strategy) {

                        case "pdf":
                            saveToPolarAsPDF(request.value)
                            break;
                        case "epub":
                            saveToPolarAsEPUB(request.value)
                            break;
                        default:
                            console.warn("Unable to handle request strategy: ", request);
                            break;

                    }

                    break;
                default:
                    console.warn("Unknown message type: ", message)
                    break;

            }

        });

    }

}

