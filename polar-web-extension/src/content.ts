// allow communication with the outside world so we can do content captures.
import {ContentCapture} from "polar-content-capture/src/capture/ContentCapture";
import {Results} from "polar-shared/src/util/Results";
import {Captured} from "polar-content-capture/src/capture/Captured";
import {DirectPHZWriter} from "polar-content-capture/src/phz/DirectPHZWriter";
import {CapturedPHZWriter} from "polar-content-capture/src/phz/CapturedPHZWriter";

const MESSAGE_TYPE_CAPTURE = 'polar-capture';

console.log("Starting content capture script (4)");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    const isCaptureRequest = () => {
        return message && message.type === MESSAGE_TYPE_CAPTURE;
    };

    const handler = async () => {

        console.log("Received a message.");

        if (! isCaptureRequest()) {
            console.log("Message is not a capture request: ", message);
            return;
        }

        const result = ContentCapture.execute();
        const captured = Results.create<Captured>(result).get();

        const writer = new DirectPHZWriter();
        const capturedPHZWriter = new CapturedPHZWriter(writer);
        await capturedPHZWriter.convert(captured);

        const data = await writer.toBase64();

        sendResponse(Results.create({data}));

    };

    handler().catch(err => {
        console.error("Unable to capture content: ", err);
        sendResponse(Results.createError(err));
    });

});

console.log("FIXME: Polar is listening for capture requests now (2");
