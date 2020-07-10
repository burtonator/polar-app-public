import {BrowserWindow} from "electron";
import {
    BROWSER_WINDOW_OPTIONS,
    MAIN_SESSION_PARTITION_NAME,
    MainAppBrowserWindowFactory
} from './MainAppBrowserWindowFactory';
import {ResourcePaths} from './ResourcePaths';
import {SingletonBrowserWindow} from './SingletonBrowserWindow';
import {Logger} from "polar-shared/src/logger/Logger";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

const log =  Logger.create();

export class AppLauncher {

    /**
     * Launch the repository app or focus it if it's already created.
     */
    public static async launchApp(): Promise<BrowserWindow> {

        const browserWindowTag = {name: 'app', value: 'repository'};

        const browserWindow = await SingletonBrowserWindow.getInstance(browserWindowTag, async () => {

            const url = ResourcePaths.resourceURLFromRelativeURL('/', false);
            log.info("Loading app from URL: " + url);

            const browserWindowOptions = Dictionaries.copyOf(BROWSER_WINDOW_OPTIONS);

            // use a 'polar-app' session so we don't use the default session
            // which is intercepted.
            browserWindowOptions.webPreferences!.partition = MAIN_SESSION_PARTITION_NAME;

            return await MainAppBrowserWindowFactory.createWindow(browserWindowOptions, url);

        });

        browserWindow.focus();

        return browserWindow;

    }

}
