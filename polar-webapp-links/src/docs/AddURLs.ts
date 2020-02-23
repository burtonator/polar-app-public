import {URLStr} from "polar-shared/src/util/Strings";
import {URLParams} from "polar-url/src/URLParams";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export class AddURLs {

    public static parseWithPathInfo(url: URLStr): AddURL | undefined {

        const regexp = "(https://app\.getpolarized\.io)?/(add|d|preview|doc-preview-import)/(http.*)";

        const matches = url.match(regexp);

        if (matches) {

            const rawTarget = (matches[3] || "").trim();

            if (rawTarget === "") {
                throw new Error("No URL given in path data: " + url);
            }

            const target = this.createCorrectedURL(rawTarget);

            return {target};

        }

        return undefined;

    }

    public static parseWithQuery(url: URLStr): AddURL | undefined {

        if (! url.startsWith("http")) {
            return undefined;
        }

        const searchParams = URLParams.parse(url);

        const parseDocInfo = (): IDocInfo | undefined => {

            const json = searchParams.get('docInfo');

            if (json) {
                return JSON.parse(json);
            }

            return undefined;

        };

        const file = searchParams.get('file');
        const docInfo = parseDocInfo();

        if (file) {

            return {
                target: file,
                docInfo
            };

        }

        return undefined;

    }

    public static parse(url: URLStr): AddURL | undefined {
        return this.parseWithQuery(url) || this.parseWithPathInfo(url);
    }


    public static createCorrectedURL(url: string): string {

        const regexp = "^(https?)(://|:/|/)(.+)";

        const matches = url.match(regexp);

        if (matches) {

            const scheme = matches[1];
            const rest = matches[3];

            return `${scheme}://${rest}`;

        }

        return url;

    }

}

export interface AddURL {

    /**
     * The target URL
     */
    readonly target: URLStr;

    readonly docInfo?: Partial<IDocInfo>;

}
