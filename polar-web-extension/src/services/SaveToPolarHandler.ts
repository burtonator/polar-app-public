import {Tabs} from "../chrome/Tabs";
import {CapturedContentEPUBGenerator} from "../captured/CapturedContentEPUBGenerator";
import {DatastoreWriter} from "../datastore/DatastoreWriter";
import {ReadabilityCapture} from "../ReadabilityCapture";
import ICapturedContent = ReadabilityCapture.ICapturedContent;
import WrittenDoc = DatastoreWriter.WrittenDoc;
import IWriteOpts = DatastoreWriter.IWriteOpts;

export namespace SaveToPolarHandler {

    function saveToPolar(capture: ICapturedContent) {

        console.log("Saving to Polar...");

        function doLoadWrittenDoc(writtenDoc: WrittenDoc) {
            const url = 'https://beta.getpolarized.io/doc/' + writtenDoc.id;

            Tabs.loadLinkInNewTab(url);
            // document.location.href = url;
        }

        async function doAsync() {

            const epub = await CapturedContentEPUBGenerator.generate(capture);

            const opts: IWriteOpts = {
                epub,
                title: capture.title,
                description: capture.description
            }

            const writtenDoc = await DatastoreWriter.write(opts)
            doLoadWrittenDoc(writtenDoc);
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

