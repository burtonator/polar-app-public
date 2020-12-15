export namespace Tabs {

    export function activeTab(): Promise<chrome.tabs.Tab | undefined> {

        return new Promise<chrome.tabs.Tab | undefined>(((resolve, reject) => {

            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

                if (tabs.length === 0) {
                    resolve(undefined);
                }

                if (tabs.length > 1) {
                    reject(new Error("Too many active tabs"));
                }

                resolve(tabs[0])

            });

        }));

    }

    /**
     * I think this is the same as activeTab but just calls a different API.
     */
    export function currentTab(): Promise<chrome.tabs.Tab | undefined> {

        return new Promise<chrome.tabs.Tab | undefined>(((resolve, reject) => {

            chrome.tabs.getCurrent((tab) => {

                if (! tab) {
                    reject(new Error("No current tab"));
                }

                resolve(tab)

            });

        }));

    }

    export function loadLinkInNewTab(link: string) {
        chrome.tabs.create({url: link});
    }

    export async function loadLinkInActiveTab(link: string) {

        const tab = await activeTab();

        if (! tab) {
            throw new Error("No active tab");
        }

        await loadLinkInTab(tab, link);

    }

    /**
     * @Deprecated I think this one isn't useful and doesn't work.
     */
    export async function loadLinkInCurrentTab(link: string) {

        const tab = await currentTab();

        if (! tab) {
            throw new Error("No current tab");
        }

        await loadLinkInTab(tab, link);

    }

    async function loadLinkInTab(tab: chrome.tabs.Tab, link: string) {

        const {id} = tab;

        chrome.tabs.update(tab.id!, {url: link});

    }

    export function queryCurrentTabForLink() {

        return new Promise<string | undefined>(resolve => {

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
                const link = tabs[0].url;
                resolve(link);
            });

        });

    }

}
