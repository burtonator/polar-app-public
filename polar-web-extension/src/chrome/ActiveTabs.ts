import {Tabs} from "./Tabs";

export namespace ActiveTabs {

    export async function sendMessage(message: any) {

        const tab = await Tabs.activeTab();

        if (tab) {
            chrome.tabs.sendMessage(tab.id!, message);
        } else {
            throw new Error("No active tab");
        }

    }

}
