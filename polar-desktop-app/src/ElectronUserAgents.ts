
export class ElectronUserAgents {

    public static computeUserAgentFromWebContents(webContents: Electron.WebContents) {
        return this.computeUserAgentFromString(webContents.userAgent);
    }

    public static computeUserAgentFromString(userAgent: string) {

        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) polar-bookshelf/1.60.14 Chrome/73.0.3683.121 Electron/5.0.11 Safari/537.36"
        userAgent = userAgent.replace(/Electron\/[0-9.]+ /, '');
        userAgent = userAgent.replace(/polar-bookshelf\/[0-9.]+ /, '');
        return userAgent;

    }

}
