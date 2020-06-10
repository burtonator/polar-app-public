import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";
import {FirebaseAuth} from "polar-bookshelf/web/js/firebase/FirebaseAuth";
import {Identity} from "./chrome/Identity";
import { Tabs } from "./chrome/Tabs";

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

async function requireAuth() {

    console.log("Verifying we're logged into Polar...");

    const authToken = await Identity.getAuthToken();

    const authHandler = AuthHandlers.get();

    const userInfo = await authHandler.userInfo();

    if (! userInfo.isPresent()) {

        console.log("Authenticating ...");

        // https://firebaseopensource.com/projects/firebase/quickstart-js/auth/chromextension/readme/
        // https://firebase.google.com/docs/auth/web/google-signin
        // https://developer.chrome.com/apps/app_identity

        await FirebaseAuth.signInWithAuthToken(authToken);

        console.log("Authenticating ...done");

    }

    console.log("Verifying we're logged into Polar...done");

}

async function startCapture() {
    const tab = await Tabs.activeTab()
    if (tab) {
        console.log("Sending start-capture");
        chrome.tabs.sendMessage(tab.id!, {type: "start-capture"});
    } else {
        console.warn("No active tab");
    }
}

export function injectContentScript() {

    chrome.tabs.executeScript({
        file: 'content-bundle.js'
    });

}

async function handleAsync() {
    await requireAuth();
    await injectContentScript();
    await startCapture();
}

/**
 * Called when the user clicks the button in the page to 'share' with Polar.
 */
async function onExtensionActivated() {
    console.log("Injecting content script...");

    handleAsync()
        .catch(err => console.error(err));

    console.log("Injecting content script...done");

}

document.addEventListener("DOMContentLoaded", () => {

    onExtensionActivated()
        .catch(err => {
            console.log("failed");
            closeWindowAfterDelay();
            console.error("Unable to send URL to polar: ", err)
        });

});
