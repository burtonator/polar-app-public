import {ImportContentAPI} from './legacy/ImportContentAPI';

function loadLinkInNewTab(link: string) {
    chrome.tabs.create({url: link});
}

async function queryCurrentTabForLink(): Promise<string> {

    return new Promise<string>(resolve => {

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
            const link = tabs[0].url;
            resolve(link);
        });

    });

}

function closeWindowAfterDelay() {
    setTimeout(() => window.close(), 7500);
}

/**
 * Called when the user clicks the button in the page to 'share' with Polar.
 */
async function onExtensionActivated() {

    // TODO: if they hit share on the PDF viewer itself try to unwrap the file
    // URL and send that instead.

    const link = await queryCurrentTabForLink();

    await ImportContentAPI.doImport(link!, document.contentType);

    closeWindowAfterDelay();
    console.log("success");

}

function setupLinkHandlers() {

    document.querySelector("#download-link")!.addEventListener('click', () => {
        loadLinkInNewTab('https://getpolarized.io/download.html?utm_source=chrome_extension_failed&utm_medium=chrome_extension');
    });

}

document.addEventListener("DOMContentLoaded", () => {

    setupLinkHandlers();

    onExtensionActivated()
        .catch(err => {
            console.log("failed");
            closeWindowAfterDelay();
            console.error("Unable to send URL to polar: ", err)
        });

});
