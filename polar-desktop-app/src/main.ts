import {app, BrowserWindow} from 'electron';
import process from 'process';
import {Version} from "polar-shared/src/util/Version";
import {MainApp} from "./MainApp";

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

    const mainApp = new MainApp();
    await mainApp.start();

}

app.on('ready', async () => {

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
        .catch(err => console.error("Unable to launch app: ", err));

});