import {WebExtensions} from './WebExtensions';

export class ExtensionInstall {

    public static async isInstalled(): Promise<boolean> {

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            const result = await WebExtensions.Messaging.sendMessage({});
            return result !== null;
        }

        return false;

    }

}
