import {BrowserWindow, screen, shell} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';
import {ElectronUserAgents} from "./ElectronUserAgents";
import { FilePaths } from "polar-shared/src/util/FilePaths";

const log = Logger.create();

const IS_DEV = process.env.ELECTRON_ENV === 'development';

// export const DEFAULT_URL = 'https://beta.getpolarized.io';
export const DEFAULT_URL = IS_DEV ? 'http://localhost:8050' : 'https://app.getpolarized.io';

console.log(`Using ${DEFAULT_URL} - to use localhost export ELECTRON_ENV=development`)

const WIDTH = 1100 * 1.2; // 1300 is like 80% of users
const HEIGHT = 900 * 1.2;

// TODO: files in the root are always kept in the package we can just load
// this as a native_image directly.
export const APP_ICON = FilePaths.resolve(__dirname, 'build', 'icons', 'icon.ico');

export const BROWSER_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = Object.freeze({
    backgroundColor: '#FFF',
    width: WIDTH,
    height: HEIGHT,
    show: false,
    // frame: false,
    // titleBarStyle: "hidden",
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    // TODO: make the app icon a data URL?
    icon: APP_ICON,
    webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInSubFrames: false,
        nodeIntegrationInWorker: false,
        defaultEncoding: 'UTF-8',
        webSecurity: true,
        webaudio: true,
        enableRemoteModule: false,
        nativeWindowOpen: true,
        webviewTag: false
    }

});

export namespace MainAppBrowserWindowFactory {

    export function createWindow(browserWindowOptions: Electron.BrowserWindowConstructorOptions = BROWSER_WINDOW_OPTIONS,
                                 url = DEFAULT_URL): Promise<BrowserWindow> {

        // ElectronUserAgents.registerUserAgentHandler(MAIN_SESSION_PARTITION_NAME);

        browserWindowOptions = {...browserWindowOptions};

        console.log("Starting with browserWindowOptions: ", browserWindowOptions);

        const position = computeXY();

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

            {original: 'minHeight', dimension: 'height', defaultValue: 400},
            {original: 'minWidth', dimension: 'width', defaultValue: 300},

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
        const browserWindow = new BrowserWindow(browserWindowOptions);

        // compute the userAgent that we should be using for the renderer
        const userAgent = ElectronUserAgents.computeUserAgentFromWebContents(browserWindow.webContents);
        // const userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) polar-desktop-app/2.0.53 Chrome/80.0.3987.165 Safari/537.36";
        // const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) polar-desktop-app/2.0.108 Chrome/87.0.4280.141 Safari/537.36"
        registerWindowNavigationHandler(browserWindow);

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

    function registerWindowNavigationHandler(browserWindow: BrowserWindow) {

        // if we are creating a new window but the URL is NOT the current app
        // then we should open it in a native browser window.

        browserWindow.webContents.on('new-window', (event, url) => {

            function isExternal() {
                const appURL = new URL(DEFAULT_URL);
                const parsedURL = new URL(url);
                return appURL.host !== parsedURL.host;
            }

            if (isExternal()) {

                console.log("Opening URL in external browser: ", url);

                event.preventDefault();
                shell.openExternal(url, {activate: true})
                     .catch(err => log.error("Could not open external URL", err, url));
            }

        });

    }

    function computeXY(): Position | undefined {

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

