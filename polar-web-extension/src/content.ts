import {ReadabilityCapture} from "./ReadabilityCapture";
import {CaptureApp} from "./ui/capture/CaptureApp";

function clearDocument() {
    // clear the document so that we can render to it directly.

    const title = document.title;

    document.documentElement.innerHTML = `<html><head><title>${title}</title></head><body></body></html>`;
}

function handleStartCapture() {

    console.log("Starting capture...");

    const capture = ReadabilityCapture.capture();

    console.log("Captured: ", capture);

    clearDocument();

    CaptureApp.start(capture);

}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//
//     console.log("got message: ", message);
//
//     if (! message.type) {
//         return;
//     }
//
//     switch (message.type) {
//
//         case 'start-capture':
//             break;
//
//     }
//
// });

handleStartCapture();

console.log("Content script loaded");
