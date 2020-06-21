import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";
import {Tracer} from "polar-shared/src/util/Tracer";
import {PopupApp} from "./ui/popup/PopupApp";
import {Tabs} from "./chrome/Tabs";
import loadLinkInActiveTab = Tabs.loadLinkInActiveTab;
import {SignInSuccessURLs} from "polar-bookshelf/apps/repository/js/login/SignInSuccessURLs";

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

async function requireAuth(): Promise<boolean> {

    console.log("Verifying we're logged into Polar...");

    const authHandler = AuthHandlers.get();

    console.log("Getting userInfo...");

    const userInfo = await Tracer.async(() => authHandler.userInfo(), 'userInfo');

    console.log("Getting userInfo...done");

    if (! userInfo.isPresent()) {

        console.log("Authenticating ...");

        async function createSignInURL(): Promise<string> {

            const baseURL = `${document.location.origin}/login.html`;
            const signInSuccessUrl = await Tabs.queryCurrentTabForLink();
            console.log("Using signInSuccessUrl: ", signInSuccessUrl);
            return SignInSuccessURLs.createSignInURL(signInSuccessUrl, baseURL);

        }

        const signInURL = await createSignInURL();
        await loadLinkInActiveTab(signInURL);

        // https://firebaseopensource.com/projects/firebase/quickstart-js/auth/chromextension/readme/
        // https://firebase.google.com/docs/auth/web/google-signin
        // https://developer.chrome.com/apps/app_identity

        console.log("Authenticating ...done");

        return false;

    } else {
        console.log("Already authenticated.");
    }

    console.log("Verifying we're logged into Polar...done");

    return true;

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
    const authenticated = await requireAuth();

    if (authenticated) {
        await injectContentScript();
    }

    window.close();

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
            // closeWindowAfterDelay();
            console.error("Unable to send URL to polar: ", err)
        });

});
