import {ReadabilityCapture} from "./ReadabilityCapture";
import {CaptureApp} from "./ui/capture/CaptureApp";
import {SaveToPolarHandler} from "./services/SaveToPolarHandler";
import SaveToPolarRequestWithPDF = SaveToPolarHandler.SaveToPolarRequestWithPDF;

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

    const message: SaveToPolarRequestWithPDF = {
        type: 'save-to-polar',
        strategy: 'pdf',
        value: {
            url: document.location.href
        }
    }

    chrome.runtime.sendMessage(message);

}

function handleStartCapture() {

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
