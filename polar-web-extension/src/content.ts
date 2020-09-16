import {ReadabilityCapture} from "./ReadabilityCapture";
import {CaptureApp} from "./ui/capture/CaptureApp";
import {SaveToPolarHandler} from "./services/SaveToPolarHandler";
import SaveToPolarRequestWithPDF = SaveToPolarHandler.SaveToPolarRequestWithPDF;
import {UploadProgressApp} from "./ui/capture/UploadProgressApp";

const PDF_CONTENT_TYPE = 'application/pdf';

function clearDocument() {
    // clear the document so that we can render to it directly.

    const title = document.title;

    document.documentElement.innerHTML = `<html><head><title>${title}</title></head><body></body></html>`;

}

function handleStartCaptureWithEPUB() {

    const capture = ReadabilityCapture.capture();

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
