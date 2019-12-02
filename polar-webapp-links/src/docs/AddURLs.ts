import {URLStr} from "polar-shared/src/util/Strings";

export class AddURLs {

    public static parse(url: URLStr): AddURL | undefined {

        const regexp = "(https://app\.getpolarized\.io)?/add/(.*)";

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
}
