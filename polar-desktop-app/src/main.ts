import {app, BrowserWindow, session, dialog} from 'electron';
import process from 'process';
import {Version} from "polar-shared/src/util/Version";
import {MainApp} from "./MainApp";
import {DEFAULT_URL} from "./MainAppBrowserWindowFactory";
import 'source-map-support/register'

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (process.env.POLAR_DISABLE_HARDWARE_ACCELERATION === 'true') {
    console.log("Disabling hardware acceleration");
    app.disableHardwareAcceleration();
}

if (!hasSingleInstanceLock) {
    console.error("Quiting.  App is single instance.");
    app.quit();
}

// needed to disable site isolation because it doesn't actually allow us to
// disable web security properly.
app.commandLine.appendSwitch('disable-site-isolation-trials');

async function launch() {

    console.log("Running with CWD: " + process.cwd());
    console.log("Running with Node version: " + process.version);
    console.log("Running with Electron version: " + process.versions.electron);
    console.log("Running with Polar version: " + Version.get());
    console.log("Running with app version: " + app.getVersion());

    await MainApp.start();

}


function allowAnkiSyncOrigin() {

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {

        function isAnkiSyncRequest() {
            const parsedURL = new URL(details.url);
            return parsedURL.hostname === 'localhost' && parsedURL.port === '8765';
        }

        if (! isAnkiSyncRequest()) {
            callback({});
            return;
        }


        console.log("Adding Access-Control-Allow-Origin for Anki sync");

        const additionalHeaders = {
            "Access-Control-Allow-Origin": [ DEFAULT_URL ]
        };

        const newResponseHeaders = {...details.responseHeaders, ...additionalHeaders};

        callback({ responseHeaders: newResponseHeaders});

    });

}

function handleError(err: Error) {

    const title = 'Unable to launch Polar: '
    const message = 'An error occurred: \n' + err.message + "\n" + err.stack;

    function handleConsole() {
        console.error(title, err);
    }

    function handleGUI() {
        dialog.showMessageBoxSync({
            title,
            type: 'error',
            message
        });

    }

    handleConsole();
    handleGUI();

}

app.on('ready', async () => {

    allowAnkiSyncOrigin();

    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //
    //     if (! details.url.startsWith('http:') && ! details.url.startsWith('https:')) {
    //         callback({});
    //         return;
    //     }
    //
    //     console.log("FIXME: adding CSP headers");
    //
    //     const additionalHeaders = {
    //         "Content-Security-Policy": [ "default-src 'self'" ]
    //     };
    //
    //     const newResponseHeaders = {...details.responseHeaders, ...additionalHeaders};
    //
    //     callback({ responseHeaders: newResponseHeaders});
    //
    // });

    const configureReactDevTools = () => {

        const path = process.env.POLAR_REACT_DEV_TOOLS;

        if (path) {
            console.log("Enabling react dev tools");
            // /Users/burton/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.6.0_0/
            BrowserWindow.addDevToolsExtension(path);
        }

    };

    configureReactDevTools();

    launch()
        .catch(handleError);

});
