import {BrowserWindow, screen, shell} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';
import {ElectronUserAgents} from "./ElectronUserAgents";
import {ExternalNavigationBlock} from "./ExternalNavigationBlock";

const log = Logger.create();

export const DEFAULT_URL = 'https://beta.getpolarized.io';

const WIDTH = 900 * 1.2; // 1300 is like 80% of users
const HEIGHT = 1100 * 1.2;
const SIDEBAR_BUFFER = 100;

// TODO: files in the root are always kept in the package we can just load
// this as a native_image directly.
// export const APP_ICON = ResourcePaths.resourceURLFromRelativeURL('./build/icons/icon.png');

export const BROWSER_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = Object.freeze({
    backgroundColor: '#FFF',
    width: WIDTH + SIDEBAR_BUFFER,
    height: HEIGHT,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    // TODO: make the app icon a data URL?
    // icon: APP_ICON,
    webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInSubFrames: false,
        defaultEncoding: 'UTF-8',
        webSecurity: true,
        webaudio: true,
        nativeWindowOpen: true
    }

});

export class MainAppBrowserWindowFactory {

    public static createWindow(browserWindowOptions: Electron.BrowserWindowConstructorOptions = BROWSER_WINDOW_OPTIONS,
                               url = DEFAULT_URL): Promise<BrowserWindow> {

        // ElectronUserAgents.registerUserAgentHandler(MAIN_SESSION_PARTITION_NAME);

        browserWindowOptions = Object.assign({}, browserWindowOptions);

        const position = this.computeXY();

        if (position) {
            // add some offset to this window so that the previous window and
            // the current one don't line up perfectly or else it seems like
            // nothing happened or that the new window replaced the old one.
            browserWindowOptions.x = position.x;
            browserWindowOptions.y = position.y;
        }

        const display = screen.getPrimaryDisplay();

        // make sure minHeight, maxHeight, width, and height are NOT larger
        // than the current screen dimensions.

        interface DimensionMapping {
            readonly original: 'minWidth' | 'minHeight' | 'width' | 'height';
            readonly dimension: 'width' | 'height';
            readonly defaultValue?: number;
        }

        const dimensionMappings: DimensionMapping[] = [

            {original: 'minHeight', dimension: 'height', defaultValue: 800},
            {original: 'minWidth', dimension: 'width', defaultValue: 600},

            {original: 'height', dimension: 'height'},
            {original: 'width', dimension: 'width'}

        ];

        for (const dimensionMapping of dimensionMappings) {

            const current = browserWindowOptions[dimensionMapping.original]! || dimensionMapping.defaultValue!;
            const max = display.size[dimensionMapping.dimension];

            browserWindowOptions[dimensionMapping.original]
                = Math.min(current, max);

        }

        // log.notice("Creating browser window with options: ", browserWindowOptions);

        // Create the browser window.
        const browserWindow = new BrowserWindow();

        browserWindow.webContents.on('new-window', (e, newURL) => {

            if (ExternalNavigationBlock.get()) {

                e.preventDefault();
                shell.openExternal(newURL)
                    .catch(err => log.error("Could not open external URL", err, newURL));

            } else {
                log.notice("Allowing external navigation to new window URL: " + newURL);
            }

        });

        browserWindow.webContents.on('will-navigate', (e, navURL) => {

            if (! ExternalNavigationBlock.isExternal(navURL)) {
                console.log("Allowing URL: " + navURL);
                return;
            }

            if (ExternalNavigationBlock.get()) {

                log.info("Attempt to navigate to new URL: ", navURL);
                // required to force the URLs clicked to open in a new browser.  The
                // user probably / certainly wants to use their main browser.
                e.preventDefault();
                shell.openExternal(navURL)
                    .catch(err => log.error("Cloud open external URL", err, url));

            } else {
                log.notice("Allowing external navigation to: " + navURL);
                return;
            }

        });

        // compute the userAgent that we should be using for the renderer
        const userAgent = ElectronUserAgents.computeUserAgentFromWebContents(browserWindow.webContents);

        log.info("Loading URL: " + url);
        browserWindow.loadURL(url, {userAgent})
            .catch(err => log.error("Could not load URL ", err, url));

        return new Promise<BrowserWindow>(resolve => {

            browserWindow.once('ready-to-show', () => {

                // As of Electron 3.0 beta8 there appears to be a bug where
                // it persists the zoom factor between restarts and restores
                // the zoom factorbrowserWindow.webContents.zoomFactor = 1.0;

                browserWindow.show();

                resolve(browserWindow);

            });

        });

    }

    private static computeXY(): Position | undefined {

        const offset = 35;

        const focusedWindow = BrowserWindow.getFocusedWindow();

        if (focusedWindow) {
            const position = focusedWindow.getPosition();
            let x = position[0];
            let y = position[1];

            x += offset;
            y += offset;

            return {x, y};

        }

        return undefined;

    }

}

interface Position {
    x: number;
    y: number;
}

