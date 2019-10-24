import {webextensions} from "polar-web-extension-api/src/WebExtensions";
import {Tabs} from "./chrome/Tabs";

export class ExtensionContentCaptureClient {

    public static async capture() {
        const tab = await Tabs.activeTab();
        return webextensions.Tabs.sendMessage(tab.id!, {type: 'polar-capture'});
    }

}
