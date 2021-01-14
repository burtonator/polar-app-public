import {CaptureApp} from "./ui/capture/CaptureApp";
import {SaveToPolarHandler} from "./services/SaveToPolarHandler";
import SaveToPolarRequestWithPDF = SaveToPolarHandler.SaveToPolarRequestWithPDF;
import {UploadProgressApp} from "./ui/capture/UploadProgressApp";
import {ExtensionContentCapture} from "./capture/ExtensionContentCapture";

const PDF_CONTENT_TYPE = 'application/pdf';

function clearDocument() {
    // clear the document so that we can render to it directly.

    const title = document.title;

    document.documentElement.innerHTML = `<html><head><title>${title}</title></head><body></body></html>`;

}

function handleStartCaptureWithEPUB() {

    const capture = ExtensionContentCapture.capture();

    console.log("Captured: ", capture);

    clearDocument();

    CaptureApp.start(capture);

}

function handleStartCaptureWithPDF() {

    console.log("handleStartCaptureWithPDF");

    function triggerSaveToPolar() {

        const message: SaveToPolarRequestWithPDF = {
            type: 'save-to-polar',
            strategy: 'pdf',
            value: {
                url: document.location.href
            }
        }

        chrome.runtime.sendMessage(message);

    }

    function createUI() {

        if (! document) {
            console.warn("No document. Not starting UI");
            return;
        }

        const container = document.createElement('div');

        if (! document.body) {
            console.warn("No body. Not starting UI");
            return;
        }

        document.body.appendChild(container);

        UploadProgressApp.start(container);
        console.log("UploadProgressApp started")

    }

    createUI();
    triggerSaveToPolar();

}

export function handleStartCapture() {

    console.log("Starting capture...");

    // rong can implement zotero translation server here...

    // IZoteroTranslation | undefined
    // const translation = ZoteroTranslation.translate(document.location.href, document.outerHTML);
    //
    // if (translation) {
    //
    //     if (hasPDFAttachment(translation)) {
    //         handleStartCaptureWithTranslation(translation);
    //     }
    //
    // }

    // send ZoteroTranslationRequest to background script
    // wait for backgroundScript repsonse

    // 1. Give the current HTML content and URL to a
    //
    // ZoteroTranslationServerHandler that runs in the background page.
    //
    // 2.  That will do the translation and compute an IZoteroTranslation object
    // (or undefined if there is no metadata/attachment) that we then send to
    // the content script (this script).
    //
    // 3. The  ZoteroTranslationServerHandler will sendResponse do do that.
    //
    // 4. The caller will have to handle onResponse callback.  We might want to
    //    wrap this and use async/await
    //
    // 5. If we have a translation, call a new method like handleStartCaptureWithPDF
    // with translation that will add the extra fields.

    // const zoteroTranslation = await ZoteroTranslations.exec();
    //
    // 6. Update the save-to-polar handler to include the new metadata with the
    // PDF (SaveToPolarHandler.ts)

    if (document.contentType === PDF_CONTENT_TYPE) {
        // this is just a raw PDF... so start the import.
        handleStartCaptureWithPDF();
        return;
    } else {
        handleStartCaptureWithEPUB();
    }

}

handleStartCapture();

console.log("Content script loaded");
