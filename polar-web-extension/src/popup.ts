import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";
import {FirebaseAuth} from "polar-bookshelf/web/js/firebase/FirebaseAuth";
import {Identity} from "./chrome/Identity";
import {Tracer} from "polar-shared/src/util/Tracer";
import {PopupScriptMessages} from "./PopupScriptMessages";
import {PopupApp} from "./ui/popup/PopupApp";

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

async function requireAuth() {

    console.log("Verifying we're logged into Polar...");

    console.log("Getting auth token...");

    const authToken = await Tracer.async(() => Identity.getAuthToken(), 'getAuthToken');

    console.log("Getting auth token...done");

    const authHandler = AuthHandlers.get();

    console.log("Getting userInfo...");

    const userInfo = await Tracer.async(() => authHandler.userInfo(), 'userInfo');

    console.log("Getting userInfo...done");

    if (! userInfo.isPresent()) {

        console.log("Authenticating ...");

        // https://firebaseopensource.com/projects/firebase/quickstart-js/auth/chromextension/readme/
        // https://firebase.google.com/docs/auth/web/google-signin
        // https://developer.chrome.com/apps/app_identity

        await FirebaseAuth.signInWithAuthToken(authToken);

        console.log("Authenticating ...done");

    } else {
        console.log("Already authenticated.");
    }

    console.log("Verifying we're logged into Polar...done");

}

export function injectContentScript() {

    console.log("Injecting content script...");

    chrome.tabs.executeScript({
        file: 'content-bundle.js'
    });

    console.log("Injecting content script...done");

}

export function startApp() {
    console.log("Starting react app...");
    PopupApp.start();
    console.log("Starting react app...done");
}

async function handleExtensionActivated() {

    startApp();
    await requireAuth();
    await injectContentScript();

    // TODO: I think we have to await a 'ready' message here OR we just have to
    // make the main() method start upon injection...
    await PopupScriptMessages.sendStartCapture();

}

/**
 * Called when the user clicks the button in the page to 'share' with Polar.
 */
async function onExtensionActivated() {

    handleExtensionActivated()
        .catch(err => console.error("Unable to handle popup: ", err));

}

document.addEventListener("DOMContentLoaded", () => {

    onExtensionActivated()
        .catch(err => {
            console.log("failed");
            closeWindowAfterDelay();
            console.error("Unable to send URL to polar: ", err)
        });

});
