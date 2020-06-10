import {ReadabilityCapture} from "./ReadabilityCapture";
import {CaptureApp} from "./ui/CaptureApp";

function handleStartCapture() {

    console.log("got start-capture message");

    const capture = ReadabilityCapture.capture();

    document.documentElement.innerHTML = `<html><body></body></html>`;

    CaptureApp.start(capture);

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("got message: ", message);

    if (! message.type) {
        return;
    }

    switch (message.type) {

        case 'start-capture':
            handleStartCapture();
            break;

    }

});

console.log("Content script loaded");
