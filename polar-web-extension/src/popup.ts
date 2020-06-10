import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";
import {FirebaseAuth} from "polar-bookshelf/web/js/firebase/FirebaseAuth";
import {Identity} from "./chrome/Identity";
import {Tracer} from "polar-shared/src/util/Tracer";
import {PopupScriptMessages} from "./PopupScriptMessages";

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

async function requireAuth() {

    console.log("Verifying we're logged into Polar...");

    const authToken = await Tracer.async(Identity.getAuthToken, 'getAuthToken');

    const authHandler = AuthHandlers.get();

    const userInfo = await Tracer.async(() => authHandler.userInfo(), 'userInfo');

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

export function injectContentScript() {

    chrome.tabs.executeScript({
        file: 'content-bundle.js'
    });

}

async function handleAsync() {
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
