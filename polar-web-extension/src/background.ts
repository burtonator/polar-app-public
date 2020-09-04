import {InitialSplash} from './InitialSplash';
import {ImportContentHandler} from './legacy/ImportContentHandler';
import {BrowserScreenshotHandler} from './BrowserScreenshotHandler';
import {ExtensionInstallHandler} from './ExtensionInstallHandler';
import {SaveToPolarHandler} from "./services/SaveToPolarHandler";
import {PingHandler} from "./services/PingHandler";

InitialSplash.register();
ImportContentHandler.register();
BrowserScreenshotHandler.register();
ExtensionInstallHandler.register();
SaveToPolarHandler.register();
PingHandler.start();


