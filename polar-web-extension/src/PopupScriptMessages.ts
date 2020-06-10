import {ActiveTabs} from "./chrome/ActiveTabs";

export namespace PopupScriptMessages {

    export async function sendStartCapture() {
        await ActiveTabs.sendMessage({type: "start-capture"})
    }

}
