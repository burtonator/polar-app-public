import {ReadabilityCapture} from "./ReadabilityCapture";

export namespace ContentScriptMessages {

    import ICapturedContent = ReadabilityCapture.ICapturedContent;

    /**
     * Send a 'capture-content' message that will trigger creating the
     * doc and saving in Polar.
     */
    export function sendCaptureContent(content: ICapturedContent) {
        chrome.runtime.sendMessage({type: 'capture-content', value: content});
    }

}
