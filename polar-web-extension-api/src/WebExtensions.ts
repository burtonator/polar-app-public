import {DataURL} from 'polar-shared/src/util/DataURLs';
import {Preconditions} from "polar-shared/src/Preconditions";

const EXTENSION_IDS = [
    "mklidoahhflhlpcpigokeckcipaibopd", // beta
    "jkfdkjomocoaljglgddnmhcbolldcafd"  // prod
];

export namespace WebExtensions {

    export class Runtime {

        public static async sendMessage(extensionID: string, message: any): Promise<any> {

            return new Promise<any>(resolve => {
                chrome.runtime.sendMessage(extensionID, message, result => resolve(result));
            });

        }

    }

    /**
     * Reliably sends a message to OUR extension.
     */
    export class Messaging {

        public static async sendMessage(message: any): Promise<any> {

            for (const extension of EXTENSION_IDS) {

                const result = await Runtime.sendMessage(extension, message);

                if (result) {
                    // will be null if nothing saw the call
                    return result;
                }

            }

            console.warn("No results from any web extensions with IDs: ", EXTENSION_IDS);

            return null;

        }

    }

    export class Windows {

        public static async getCurrent(): Promise<chrome.windows.Window> {

            return new Promise(resolve => {

                chrome.windows.getCurrent(window => {
                    resolve(window);
                });

            });

        }

    }

    export class Tabs {

        public static async captureVisibleTab(): Promise<DataURL> {

            const win = await Windows.getCurrent();

            return new Promise(resolve => {

                chrome.tabs.captureVisibleTab(win.id, {format: 'png'}, dataURL => {
                    resolve(dataURL);
                });

            });

        }

        public static async sendMessage(tabId: number, message: any): Promise<any> {

            Preconditions.assertPresent(tabId, 'tabId');

            return new Promise((resolve, reject) => {
                try {
                    chrome.tabs.sendMessage(tabId, message, response => resolve(response));
                } catch (e) {
                    reject(e);
                }

            })

        }

    }

}
