import {WebExtensions} from './WebExtensions';
import {isPresent} from "polar-shared/src/Preconditions";

export class ExtensionInstall {

    public static async isInstalled(): Promise<boolean> {

        if (chrome && chrome.runtime && isPresent(chrome.runtime.sendMessage)) {
            const result = await WebExtensions.Messaging.sendMessage({});
            return result !== null;
        }

        return false;

    }

}
