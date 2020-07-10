import {app, BrowserWindow} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AppLauncher} from './AppLauncher';
import process from "process";
import {MainAppExceptionHandlers} from './MainAppExceptionHandlers';
import {ExternalNavigationBlockDelegates} from "./ExternalNavigationBlockDelegates";

const log = Logger.create();

export class MainApp {

    public async start(): Promise<MainAppStarted> {

        MainAppExceptionHandlers.register();

        ExternalNavigationBlockDelegates.init();

        log.info("Electron app path is: " + app.getAppPath());

        log.info("App loaded from: ", app.getAppPath());

        // NOTE: removing the next three lines removes the colors in the
        // toolbar. const appIcon = new Tray(app_icon);
        // appIcon.setToolTip('Polar Bookshelf');
        // appIcon.setContextMenu(contextMenu);

        const mainWindow = await AppLauncher.launchApp();

        // create a session and configure it for the polar which is persistent
        // across restarts so that we do not lose cookies, etc.

        // mainSession.cookies.get({}, (err, cookies) => {
        //
        //     cookies.filter(cookie => {
        //         console.log("Found cookie: " , cookie);
        //     });
        //
        // });

        // const cacheInterceptorService =
        //     new CachingStreamInterceptorService(cacheRegistry, mainSession.protocol);

        // await cacheInterceptorService.start()
        //     .catch(err => log.error(err));

        log.info("Running with process.args: ", JSON.stringify(process.argv));

        app.on('second-instance', async (event, commandLine) => {

            log.info("Someone opened a second instance.");

            // const fileArg = Cmdline.getDocArg(commandLine);
            //
            // if (fileArg) {
            //
            //     FileImportClient.send(FileImportRequests.fromPath(fileArg));
            //
            // } else {
            //     mainAppController.activateMainWindow();
            // }

        });

        // quit when all windows are closed.
        app.on('window-all-closed', function() {

            // determine if we need to quit:
            log.info("No windows left. Quitting app.");

            const forcedExit = () => {

                try {

                    log.info("Forcing app quit...");
                    app.quit();
                    log.info("Forcing process exit...");
                    process.exit();

                } catch (e) {
                    log.error("Unable to force exit: ", e);
                }

            };

            const gracefulExit = () => {

                try {
                    // mainAppController.exitApp();
                } catch (e) {
                    log.error("Failed graceful exit: ", e);
                    forcedExit();

                }

            };

            gracefulExit();


        });

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

        return {mainWindow};

    }

}

export interface MainAppStarted {
    mainWindow: BrowserWindow;
}

