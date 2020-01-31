import {RegExps, RegexStr} from "../util/RegExps";

/**
 * Takes a path with path-to-regex syntax and computed it as a regular expression.
 */
export class PathToRegexps {

    // TODO: migrate to using: path-to-regexp as this is what react-router is
    // using internally.
    //
    // https://github.com/pillarjs/path-to-regexp/tree/v1.7.0
    //
    // WARNING: I tried but the typescript bindings aren't functional

    public static pathToRegexp(pattern: string): URLRegularExpressionStr {

        pattern = RegExps.escape(pattern);

        return pattern.replace(/(\/)(:[^/]+)/g, (subst, ...args: any[]): string => {
            return args[0] + "([^/]+)";
        });

    }

}

/**
 * A URL Path string similar to path-to-regexp which allows parts like /group/:group for easier
 * management of the regular expressions.
 */
export type URLPathStr = string;

export type URLRegularExpressionStr = RegexStr;
