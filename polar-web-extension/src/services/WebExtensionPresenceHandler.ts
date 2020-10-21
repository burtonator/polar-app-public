import {Version} from "polar-shared/src/util/Version";
import {WebExtensions} from "polar-web-extension-api/src/WebExtensions";
import {WebExtensionPresenceClient} from "polar-web-extension-api/src/WebExtensionPresenceClient";

export namespace WebExtensionPresenceHandler {

    import IPresenceMessage = WebExtensionPresenceClient.IPresenceMessage;
    export type SendResponseCallback = (response: any) => void;

    export function start() {

        chrome.runtime.onMessageExternal.addListener(onMessageHandler);

        // send in case anyone is listening and raced before the start.
        sendPresenceToPolarApp();

    }

    export function stop() {
        chrome.runtime.onMessageExternal.removeListener(onMessageHandler);
    }

    /**
     * If any tabs are open for Polar send them a message that we're open.
     */
    function sendPresenceToPolarApp() {

        async function doAsync() {

            const tabs = await WebExtensions.Tabs.query({url: '*://*.getpolarized.io/'});

            for (const tab of tabs) {

                if (tab.id === undefined) {
                    continue;
                }

                await WebExtensions.Tabs.sendMessage(tab.id, createPresenceMessage());

            }

        }

        doAsync().catch(err => console.error(err));

    }

    function createPresenceMessage(): IPresenceMessage {
        return {
            type: 'presence',
            version: Version.get()
        };
    }

    function onMessageHandler(request: any,
                              sender: chrome.runtime.MessageSender,
                              sendResponse: SendResponseCallback) {

        if (request.type !== 'presence') {
            return;
        }

        sendResponse(createPresenceMessage())

    }

}
