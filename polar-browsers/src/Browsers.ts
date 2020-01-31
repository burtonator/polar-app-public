import {UAParser} from "ua-parser-js";

export class Browsers {

    public static get(): Browser | undefined {
        const parser = new UAParser();
        const result = parser.getResult();


        const name = result.browser.name?.toLocaleLowerCase();

        if (name && ['chrome', 'chromium', 'safari', 'firefox'].includes(name)) {

            const browser = {
                id: name,
                version: result.browser.version!
            };

            return <Browser> browser;

        }

        return undefined;

    }

    public static raw(): RawBrowser {
        const parser = new UAParser();
        return parser.getResult();
    }

}

export interface RawBrowser extends IUAParser.IResult {

}

export interface Browser {
    readonly id: BrowserID;
    readonly version: string;
}

export type BrowserID = 'chrome' | 'chromium' | 'firefox' | 'safari';
