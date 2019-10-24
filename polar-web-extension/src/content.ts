// allow communication with the outside world so we can do content captures.
import {ContentCapture} from "polar-content-capture/src/capture/ContentCapture";
import {Results} from "polar-shared/src/util/Results";
import {Captured} from "polar-content-capture/src/capture/Captured";
import {DirectPHZWriter} from "polar-content-capture/src/phz/DirectPHZWriter";
import {CapturedPHZWriter} from "polar-content-capture/src/phz/CapturedPHZWriter";

const MESSAGE_TYPE_CAPTURE = 'polar-capture';

window.addEventListener('message', event => {

    const source = <IPostMessage> event.source!;

    const isCaptureRequest = () => {
        return event.data && event.data.type === MESSAGE_TYPE_CAPTURE;
    };

    const handler = async () => {

        if (! isCaptureRequest()) {
            return;
        }

        const result = ContentCapture.execute();
        const captured = Results.create<Captured>(result).get();

        const writer = new DirectPHZWriter();
        const capturedPHZWriter = new CapturedPHZWriter(writer);
        await capturedPHZWriter.convert(captured);

        const data = await writer.toBase64();

        source.postMessage(Results.create({data}));

    };

    handler().catch(err => {
        console.error("Unable to capture content: ", err);
        source.postMessage(Results.createError(err));
    });

});

/**
 * This is a workaround for a bad typescript definition that prevents calling postMessage.
 */
interface IPostMessage {
    postMessage(message: any, options?: PostMessageOptions): void;
}
