import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";
import {FirebaseAuth} from "polar-bookshelf/web/js/firebase/FirebaseAuth";

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

async function getAuthToken() {

    return new Promise<string>((resolve, reject) => {

        try {

            if (! chrome) {
                throw new Error('no chrome');
            }

            if (! chrome.identity) {
                throw new Error('no chrome.identity');
            }

            chrome.identity.getAuthToken({'interactive': true}, function (token) {
                resolve(token);
            });


        } catch (e) {
            reject(e);
        }

    })


}

async function handleAsync() {

    // FIXME: firebase MAY NOT work here because there's no .html page to
    // inject it with.

    console.log("Verifying we're logged into Polar...");

    const authToken = await getAuthToken();

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

/**
 * Called when the user clicks the button in the page to 'share' with Polar.
 */
async function onExtensionActivated() {
    console.log("Injecting content script...");

    // chrome.tabs.executeScript({
    //     file: 'content-bundle.js'
    // });

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
