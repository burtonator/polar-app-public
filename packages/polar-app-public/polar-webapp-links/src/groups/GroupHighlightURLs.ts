import { PathToRegexps } from "polar-shared/src/url/PathToRegexps";
import {IDStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";

export class GroupHighlightURLs {

    public static parse(url: string): GroupHighlightURL {

        // TODO: this pulls in a huge dependency graph just for this simple API call.
        const re = PathToRegexps.pathToRegexp('/group/:group/highlight/:id');

        const pathname = URLs.pathname(url);

        const matches = pathname.match(re);

        if (matches) {
            return {
                name: matches[1],
                id: matches[2],
            };
        }

        throw new Error("Could not parse URL");
    }

}


export interface GroupHighlightURL {
    readonly id: IDStr;
    readonly name: string;
}
