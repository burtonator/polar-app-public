import {BrowserWindow} from "electron";
import {
    BROWSER_WINDOW_OPTIONS,
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
    public static async launchApp(): Promise<BrowserWindow | null> {

        const browserWindowTag = {name: 'app', value: 'repository'};

        const browserWindow = await SingletonBrowserWindow.getInstance(browserWindowTag, async () => {

            const url = ResourcePaths.resourceURLFromRelativeURL('/', false);
            log.info("Loading app from URL: " + url);

            const browserWindowOptions = Dictionaries.copyOf(BROWSER_WINDOW_OPTIONS);

            return await MainAppBrowserWindowFactory.createWindow(browserWindowOptions, url);

        });

        if (browserWindow) {
            browserWindow.focus();
        }

        return browserWindow;

    }

}
