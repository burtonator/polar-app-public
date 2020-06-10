import {ReadabilityCapture} from "./ReadabilityCapture";

function handleStartCapture() {

    console.log("got start-capture message");

    const capture = ReadabilityCapture.capture();

    document.documentElement.innerHTML = capture.content;

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
