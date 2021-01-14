import {Tabs} from "../chrome/Tabs";
import {CapturedContentEPUBGenerator} from "../captured/CapturedContentEPUBGenerator";
import {DatastoreWriter} from "../datastore/DatastoreWriter";
import {ReadabilityCapture} from "../capture/ReadabilityCapture";
import {URLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {
    WriteFileProgress,
    WriteFileProgressListener
} from "polar-bookshelf/web/js/datastore/Datastore";
import WrittenDoc = DatastoreWriter.WrittenDoc;
import IWriteOpts = DatastoreWriter.IWriteOpts;
import {ExtensionPersistenceLayers} from "./ExtensionPersistenceLayers";
import {PHZMigrations} from "./PHZMigrations";
import {PHZActiveMigrations} from "./PHZActiveMigrations";
import {ExtensionContentCapture} from "../capture/ExtensionContentCapture";

export namespace SaveToPolarHandler {

    import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;

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
        const url = 'https://app.getpolarized.io/doc/' + writtenDoc.id;
        await Tabs.loadLinkInActiveTab(url);
    }
    
    function saveToPolarAsPDF(capture: SaveToPolarHandler.ICapturedPDF,
                              progressListener: WriteFileProgressListener,
                              errorReporter: (err: Error) => void) {

        console.log("saveToPolarAsPDF")

        async function doAsync() {
            const blob = await URLs.toBlob(capture.url);
            const basename = URLs.basename(capture.url);

            const persistenceLayer = await ExtensionPersistenceLayers.create();

            try {

                const opts: IWriteOpts = {
                    persistenceLayer,
                    doc: blob,
                    type: 'pdf',
                    basename,
                    url: capture.url,
                    progressListener,
                    webCapture: false
                }

                const writtenDoc = await DatastoreWriter.write(opts)
                await doLoadWrittenDoc(writtenDoc);

            } finally {
                persistenceLayer.stop();
            }

        }

        doAsync()
            .catch(errorReporter);

    }

    function saveToPolarAsEPUB(capture: ICapturedEPUB,
                               progressListener: WriteFileProgressListener,
                               errorReporter: (err: Error) => void) {

        console.log("saveToPolarAsEPUB")

        async function doAsync() {

            const epub = await CapturedContentEPUBGenerator.generate(capture);

            const doc = ArrayBuffers.toBlob(epub);

            const fingerprint = Hashcodes.createRandomID();

            const basename = Hashcodes.createRandomID() + '.' + 'epub';

            const persistenceLayer = await ExtensionPersistenceLayers.create();

            // TODO ... Rong... pass the author

            try {

                const opts: IWriteOpts = {
                    persistenceLayer,
                    doc,
                    type: 'epub',
                    title: capture.title,
                    description: capture.description,
                    url: capture.url,
                    basename,
                    fingerprint,
                    nrPages: 1,
                    progressListener,
                    webCapture: true
                }

                const writtenDoc = await DatastoreWriter.write(opts)
                await doLoadWrittenDoc(writtenDoc);

                const migration = PHZActiveMigrations.get();

                if (migration?.url === capture.url) {
                    await PHZMigrations.doMigration(persistenceLayer,
                                                    fingerprint,
                                                    migration);
                    PHZActiveMigrations.clear();
                }

            } finally {
                persistenceLayer.stop();
            }

        }

        doAsync()
            .catch(errorReporter);

    }

    export function register() {

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

            if (! message.type) {
                console.warn("No message type: ", message)
                return;
            }

            switch (message.type) {

                case 'save-to-polar':

                    console.log("Handling save-to-polar message: ", message);

                    const request = <SaveToPolarRequest> message;

                    const progressListener = createProgressListener(sender);
                    const errorReporter = createErrorReporter(sender);

                    switch (request.strategy) {

                        case "pdf":
                            saveToPolarAsPDF(request.value, progressListener, errorReporter)
                            break;
                        case "epub":
                            saveToPolarAsEPUB(request.value, progressListener, errorReporter)
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

function createProgressListener(sender: chrome.runtime.MessageSender): WriteFileProgressListener {
    return (progress: WriteFileProgress) => {

        if (! sender.tab || ! sender.tab.id) {
            console.warn("Sender is not a tab (not sending progress).");
            return;
        }

        const message = {
            type: 'progress',
            value: progress
        };

        chrome.tabs.sendMessage(sender.tab.id, message)

    }
}

export interface IError {
    readonly message: string;
    readonly stack?: string;
}

function createErrorReporter(sender: chrome.runtime.MessageSender): (err: Error) => void {
    return (err: Error) => {

        // make sure to always report it to the console in the background tab
        // so that we have the error there too.
        console.error(err);

        if (! sender.tab || ! sender.tab.id) {
            console.warn("Sender is not a tab (not sending progress).");
            return;
        }

        const message = {
            type: 'error',
            value: {
                message: err.message,
                stack: err.stack
            }
        };

        chrome.tabs.sendMessage(sender.tab.id, message)

    }

}
