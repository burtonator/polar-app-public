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

    /**
     * Convert the rewrite to a array of source paths.
     */
    public static toSources(rewrite: BaseRewrite): ReadonlyArray<URLPathStr> {

        if (Array.isArray(rewrite.source)) {
            return rewrite.source;
        } else {
            return [<URLPathStr> rewrite.source];
        }

    }

}

export type ContentGenerator = (url: string) => Promise<string>;

export interface BaseRewrite {
    readonly source: URLPathStr | ReadonlyArray<URLPathStr>;
    readonly destination: string | ContentGenerator;
}

export interface IDRewrite {
    readonly id: IDStr;
}

export interface DestinationRewrite extends BaseRewrite {
}

/**
 * A rewrite with just one source, an id, and a destination.
 */
export interface DirectRewrite {
    readonly id: string;
    readonly source: URLPathStr;
    readonly destination: string | ContentGenerator;
}

export type Rewrite = DestinationRewrite;

export type Predicate<V, R> = (value: V) => R;

export type RewritePredicate = Predicate<string, Rewrite>;
