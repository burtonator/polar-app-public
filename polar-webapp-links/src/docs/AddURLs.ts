import {URLStr} from "polar-shared/src/util/Strings";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export class AddURLs {

    public static parse(url: URLStr): AddURL | undefined {

        const parseWithPathInfo = (): AddURL | undefined => {

            const regexp = "(https://app\.getpolarized\.io)?/add/(http.*)";

            const matches = url.match(regexp);

            if (matches) {

                const rawTarget = (matches[2] || "").trim();

                if (rawTarget === "") {
                    throw new Error("No URL given in path data: " + url);
                }

                const target = this.createCorrectedURL(rawTarget);

                return {target};

            }

            return undefined;

        }

        const parseWithQuery = (): AddURL | undefined => {

            const parsedURL = new URL(url);

            const parseDocInfo = (): IDocInfo | undefined => {

                const json = parsedURL.searchParams.get('docInfo');

                if (json) {
                    return JSON.parse(json);
                }

                return undefined;

            }

            const file = parsedURL.searchParams.get('file');
            const docInfo = parseDocInfo();

            if (file) {

                return {
                    target: file,
                    docInfo
                };

            }

            return undefined;

        }

        return parseWithQuery() || parseWithPathInfo();

    }

    public static createCorrectedURL(url: string): string {

        const regexp = "^(https?)(://|:/|/)(.+)"

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
