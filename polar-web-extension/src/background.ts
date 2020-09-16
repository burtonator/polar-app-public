import {InitialSplash} from './InitialSplash';
import {ImportContentHandler} from './legacy/ImportContentHandler';
import {BrowserScreenshotHandler} from './BrowserScreenshotHandler';
import {ExtensionInstallHandler} from './ExtensionInstallHandler';
import {SaveToPolarHandler} from "./services/SaveToPolarHandler";
import {WebExtensionPresenceHandler} from "./services/WebExtensionPresenceHandler";
import {PHZMigrationHandler} from "./services/PHZMigrationHandler";

InitialSplash.register();
ImportContentHandler.register();
BrowserScreenshotHandler.register();
ExtensionInstallHandler.register();
SaveToPolarHandler.register();
WebExtensionPresenceHandler.start();
PHZMigrationHandler.start();


