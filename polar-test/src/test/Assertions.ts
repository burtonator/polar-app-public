// WARN: we're using require directly due to a really ugly but with typescript type
// collision which makes it impossible to track down type collision across multiple
// packages.  I'm not sure why this ALWAYS hit chai but it's really frustrating
// and takes hours to fix and this is a 1 line resolution.
import {Diffs} from "./Diffs";

const {assert} = require("chai");

export interface ToJSONOpts {
    readonly ignoreWhitespace?: boolean;
    readonly unsorted?: boolean;
}

export interface CompareOpts extends ToJSONOpts {
    readonly message?: string;
}

export function assertJSON(actual: any,
                           expected: any,
                           opts: CompareOpts = {}) {

    // first convert both to JSON if necessary.
    actual = toJSON(actual, opts);
    expected = toJSON(expected, opts);

    if ( actual !== expected) {
        console.error("BEGIN ACTUAL ==========");
        console.error(actual);
        console.error("END ACTUAL   ==========");

        console.error("BEGIN EXPECTED ==========");
        console.error(expected);
        console.error("END EXPECTED   ==========");

        console.error("====== BEGIN DIFF ");
        console.error(Diffs.compute(actual, expected));
        console.error("====== END DIFF ");
    }

    try {

        assert.equal(actual, expected, opts.message);

    } catch (e) {
        console.error(e.message);
        throw e;
    }

}

interface EqualsJSONOpts {
    readonly message?: string;
    readonly unsorted?: boolean;
    readonly noError?: boolean;
}

/**
 * Testing function to compare two objects for equality.
 */
export function equalsJSON(actual: any,
                           expected: any,
                           opts: EqualsJSONOpts = {}): boolean {

    const {unsorted, noError} = opts;

    // first convert both to JSON if necessary.
    actual = toJSON(actual, {unsorted});
    expected = toJSON(expected, {unsorted});

    if (actual !== expected) {

        if (! noError) {
            console.error("BEGIN ACTUAL ==========");
            console.error(actual);
            console.error("END ACTUAL   ==========");
        }

        return false;

    }

    return true;

}

function canonicalizeWhitespace(str: string) {
    return str.replace(/[ \t]+/g, ' ')
              .replace(/\r\n/g, '\n' );
}

export function toJSON(obj: any, opts: ToJSONOpts = {}): string {

    if (typeof obj === "string") {
        // first parse it as as JSON into an object so it's serialized using
        // the same canonical function below.
        obj = JSON.parse(obj);
    }

    // if(obj instanceof Array) {
    //     if( obj.length >= 1 ) {
    //         if ((typeof obj[0]) === "string") {
    //             return obj;
    //         }
    //     }
    // }

    // also accept an array of strings.

    const replacer = (key: any, value: any) => {

        // handle set replacement...
        if (typeof value === 'object' && value instanceof Set) {
            return [...value];
        }

        return value;

    };

    if (! Array.isArray(obj) && !opts.unsorted) {

        // TODO: because of the toJSON method we might want to call JSON
        // stringify, then parse it again, then sort, then stringify again.

        obj = sorted(obj);
    }

    const result = JSON.stringify(obj, replacer, "  ");

    if (opts.ignoreWhitespace) {
        return canonicalizeWhitespace(result);
    }

    return result;

}

function sorted(dict: any): any {

    if (dict === undefined || dict === null) {
        // nothing to do here.
        return dict;
    }

    if (! (typeof dict === 'object')) {
        // if we're not a dictionary we're done
        return dict;
    }


    if (Array.isArray(dict)) {

        const result: any[] = [];

        for (let idx = 0; idx < dict.length; ++idx) {
            result[idx] = sorted(dict[idx]);
        }

        return result;

    } else {

        const result: any = {};

        Object.keys(dict).sort().forEach(key => {
            result[key] = sorted(dict[key]);
        });

        return result;

    }

}
