import {app, BrowserWindow} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AppLauncher} from './AppLauncher';
import process from "process";
import {MainAppExceptionHandlers} from './MainAppExceptionHandlers';
import {Updates} from "./updates/Updates";
import {MainAppMenus} from "./MainAppMenus";

const log = Logger.create();

export namespace MainApp {

    export async function start(): Promise<MainAppStarted> {

        MainAppExceptionHandlers.register();

        console.log("Electron app path is: " + app.getAppPath());
        console.log("App loaded from: ", app.getAppPath());
        console.log("Running with process.args: ", JSON.stringify(process.argv));

        const mainWindow = await AppLauncher.launchApp();

        MainAppMenus.setup();
        Updates.start();

        registerAppListeners();

        return {mainWindow};

    }

    function registerAppListeners() {
        AppListeners.registerSecondInstance();
        AppListeners.registerWindowAllClosed();
        AppListeners.registerActivate();
    }

}

namespace AppListeners {

    export function registerSecondInstance() {

        app.on('second-instance', async (event, commandLine) => {

            console.log("Someone opened a second instance with commandLine args: ", commandLine);

            // TODO: do a postMessage
            //
            // I can call BrowserWindow and get the main window, then focus it, then send a
            // message to to handle a file upload
            //
            // I have to call webContents.send() which is just like postMessgage but does
            // IPC, then we have to have an IPC listener there to handle the file upload
            // in a preload script that can read filesystem files
            ///
            // then from THERE we just read that into a blob, then give it over to the uploader
            // directly...

            // TODO: the LAST argument should be the path to the file
            // TODO: check if it exists first
            // TODO: how do we read a create a file object form a path

            event.preventDefault();

        });

    }

    export function registerWindowAllClosed() {

        // quit when all windows are closed.
        app.on('window-all-closed', function() {

            // determine if we need to quit:
            console.log("No windows left. Quitting app.");

            const doExit = () => {

                try {

                    log.info("Quitting app...");
                    app.quit();
                    log.info("Forcing process exit...");
                    process.exit();

                } catch (e) {
                    log.error("Unable to force exit: ", e);
                }

            };

            doExit();

        });

    }

    export function registerActivate() {

        app.on('activate', async function() {

            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open. The
            // way
            // we handle this now is that if there are no windows open we
            // re-create the document repository so they can select one.
            // Otherwise we just re-focus the most recently used window.

            const visibleWindows = BrowserWindow.getAllWindows()
                                                .filter(current => current.isVisible());

            if (visibleWindows.length === 0) {

                AppLauncher.launchApp()
                           .catch(err => log.error("Could not launch repository app: ", err));

            }

        });

    }

}

export interface MainAppStarted {
    mainWindow: BrowserWindow | null;
}

