import {ReadabilityCapture} from "./ReadabilityCapture";
import {CaptureApp} from "./ui/capture/CaptureApp";

function clearDocument() {
    // clear the document so that we can render to it directly.
    document.documentElement.innerHTML = `<html><body></body></html>`;
}

function handleStartCapture() {

    console.log("got start-capture message");

    const capture = ReadabilityCapture.capture();

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
