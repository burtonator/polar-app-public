import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";
import {Tabs} from "../chrome/Tabs";
import {PHZActiveMigrations} from "./PHZActiveMigrations";

export namespace PHZMigrationHandler {

    import IStartPHZMigrationMessage = PHZMigrationClient.IStartPHZMigrationMessage;

    export function start() {
        chrome.runtime.onMessageExternal.addListener(onMessageHandler);
    }

    export function stop() {
        chrome.runtime.onMessageExternal.removeListener(onMessageHandler);
    }

    /**
     * If any tabs are open for Polar send them a message that we're open.
     */
    function startPHZMigration(message: IStartPHZMigrationMessage) {

        async function doAsync() {
            console.log("Starting migration in origin: " + document.location.origin);
            PHZActiveMigrations.set(message);
            await Tabs.loadLinkInActiveTab(message.url);
        }

        doAsync().catch(err => console.error(err));

    }

    function onMessageHandler(request: any,
                              sender: chrome.runtime.MessageSender) {

        if (request.type !== 'start-phz-migration') {
            return;
        }

        startPHZMigration(request);

    }

}
