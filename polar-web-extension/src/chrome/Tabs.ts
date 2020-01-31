export class Tabs {

    public static activeTab(): Promise<chrome.tabs.Tab> {


        return new Promise<chrome.tabs.Tab>(((resolve, reject) => {

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {

                if (tabs.length === 0) {
                    reject(new Error("No active tab"));
                }

                if (tabs.length > 1) {
                    reject(new Error("Too many active tabs"));
                }

                resolve(tabs[0])

            });

        }));

    }
}
