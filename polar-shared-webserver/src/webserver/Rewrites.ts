import {IDStr} from "polar-shared/src/util/Strings";
import {URLPathStr, URLRegularExpressionStr} from "polar-shared/src/url/PathToRegexps";

export class Rewrites {

    public static matchesRegex(regex: URLRegularExpressionStr, path: URLPathStr): boolean {

        const re = new RegExp(regex);
        const matches = re.exec(path);

        if (matches && matches[0] === path) {
            return true;
        }

        return false;

    }

}


export type ContentGenerator = (url: string) => Promise<string>;

export interface IDRewrite {
    readonly id: IDStr;
    readonly source: string;
    readonly destination: string | ContentGenerator;
}

export interface DestinationRewrite {
    readonly source: string;
    readonly destination: string | ContentGenerator;
}

export interface FunctionRewrite {
    readonly source: string;
    readonly function: string;
}

export type Rewrite = DestinationRewrite;

export type Predicate<V, R> = (value: V) => R;

export type RewritePredicate = Predicate<string, Rewrite>;
