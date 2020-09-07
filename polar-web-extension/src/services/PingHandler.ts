import {Version} from "polar-shared/src/util/Version";
import {WebExtensionPingClient} from "polar-web-extension-api/src/WebExtensionPingClient";

export namespace PingHandler {

    import IPingResponse = WebExtensionPingClient.IPingResponse;
    export type SendResponseCallback = (response: any) => void;

    export function start() {
        chrome.runtime.onMessageExternal.addListener(onMessageHandler);

        // TODO send to existing tabs that are running polar so we can tell them
        // that the chrome extension is installed
        // WebExtensions.Tabs.sendMessage();

    }

    export function stop() {
        chrome.runtime.onMessageExternal.removeListener(onMessageHandler);
    }

    /**
     * If any tabs are open for Polar send them a message that we're open.
     */
    function sendPingToPolarApp() {
        // noop for now
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
