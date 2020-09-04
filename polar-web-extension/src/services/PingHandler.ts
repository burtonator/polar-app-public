import {Version} from "polar-shared/src/util/Version";
import {WebExtensionPingClient} from "polar-web-extension-api/src/WebExtensionPingClient";

export namespace PingHandler {

    import IPingResponse = WebExtensionPingClient.IPingResponse;
    export type SendResponseCallback = (response: any) => void;

    export function start() {
        chrome.runtime.onMessageExternal.addListener(onMessageHandler);
    }

    export function stop() {
        chrome.runtime.onMessageExternal.removeListener(onMessageHandler);
    }

    function onMessageHandler(request: any,
                              sender: chrome.runtime.MessageSender,
                              sendResponse: SendResponseCallback) {

        if (request.type !== 'ping') {
            return;
        }

        const response: IPingResponse = {
            version: Version.get()
        };

        sendResponse(response)

    }

}
