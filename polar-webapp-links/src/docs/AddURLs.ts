import {URLStr} from "polar-shared/src/util/Strings";

export class AddURLs {

    public static parse(url: URLStr): AddURL | undefined {

        const regexp = "https://app\.getpolarized\.io/add/(.*)";

        const matches = url.match(regexp);

        if (matches) {
            return {
                target: matches[1],
            };
        }

        return undefined;

    }

}

export interface AddURL {
    /**
     * The target URL
     */
    readonly target: URLStr;
}
