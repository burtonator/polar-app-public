import {DataURL} from 'polar-shared/src/util/DataURLs';
import {Preconditions} from "polar-shared/src/Preconditions";

const EXTENSION_IDS = [
    "mklidoahhflhlpcpigokeckcipaibopd", // beta
    "jkfdkjomocoaljglgddnmhcbolldcafd"  // prod
];

function hasWebExtensionSupport() {
    return typeof chrome !== 'undefined';
}

export namespace WebExtensions {



    export class Runtime {

        public static async sendMessage(extensionID: string, message: any): Promise<any> {

            if (! hasWebExtensionSupport()) {
                return;
            }

            // TODO use withPromise
            return new Promise<any>(resolve => {

                if (chrome.runtime) {
                    chrome.runtime.sendMessage(extensionID, message, result => resolve(result));
                }

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

            // TODO: migrate to withPromise

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

            // TODO: migrate to withPromise

            return new Promise((resolve, reject) => {

                try {

                    chrome.tabs.captureVisibleTab(win.id, {format: 'png'}, dataURL => {
                        resolve(dataURL);
                    });

                } catch (e) {
                    reject(e);
                }

            });

        }

        public static async query(queryInfo: chrome.tabs.QueryInfo): Promise<ReadonlyArray<chrome.tabs.Tab>> {

            return withPromise((callback) =>
                                   chrome.tabs.query(queryInfo, callback))

        }

        public static async sendMessage(tabId: number, message: any): Promise<any> {

            Preconditions.assertPresent(tabId, 'tabId');

            return withPromise<any>((callback) =>
                                        chrome.tabs.sendMessage(tabId, message, callback))

        }

    }

}


type PromiseCallback<V> = (value: V) => void;
type PromiseHandler<V> = (callback: PromiseCallback<V>) => void;

function withPromise<V>(handler: PromiseHandler<V>): Promise<V> {

    return new Promise<V>((resolve, reject) => {
        try {
            handler(value => resolve(value));
        } catch (e) {
            reject(e);
        }

    })

}
