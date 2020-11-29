/**
 * A single character
 */
export type Char = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k'
    | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x'
    | 'y' | 'z' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K'
    | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X'
    | 'Y' | 'Z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export namespace Strings {

    /**
     * Join an array of strings, with spacing but without duplicate whitespace
     * between each one.  Each item could have spacing itself os we have to
     * merge them properly.
     */
    export function joinWithSpacing(values: ReadonlyArray<string | undefined | null>) {
        return values.filter(current => current !== undefined && current !== null)
                     .map(current => current!)
                     .map(value => value.trim())
                     .join(" ");
    }

    export function generate(len: number, c: Char = 'x') {

        let buff = "";

        for (let i = 0; i < len; ++i) {
            buff += c;
        }

        return buff;

    }

    export function toPrimitive(value: string): string | number | boolean {

        if (value === "true" || value === "false") {
            return value === "true";
        }

        if (value.match(/^[0-9]+$/)) {
            return parseInt(value, 10);
        }

        if (value.match(/^[0-9]+\.[0-9]+$/)) {
            return parseFloat(value);
        }

        return value;

    }

    /**
     * Convert the string to a number or return the default value.
     */
    export function toNumber(value: string | null | undefined,
                           defaultValue: number) {

        // don't use type cooercion as the rules are insane.

        if (value && value.match(/^[0-9]+$/)) {
            return parseInt(value, 10);
        }

        return defaultValue;

    }


    export function empty(value: string | null | undefined): boolean {
        return value === null || value === undefined || value.trim() === "";
    }

    export function filterEmpty(value: string | null | undefined): string | undefined {

        if (empty(value)) {
            return undefined;
        }

        return value!;

    }

    export function lpad(str: string | number, padd: string, length: number) {

        if (typeof str === 'number') {
            str = `${str}`;
        }

        while (str.length < length) {
            str = padd + str;
        }

        return str;

    }

    export function toUnixLineNewLines(str: string) {
        return str.replace(/\r\n/g, '\n');
    }

    export function indent(text: string, padding: string) {
        text = padding + text;
        text = text.replace(/\n/g, "\n" + padding);
        return text;
    }

    export function canonicalizeWhitespace(str: string) {
        return str.replace(/[ \t]+/g, ' ')
                  .replace(/\r\n/g, '\n' );
    }

    /**
     * Make the first character uppercase.
     */
    export function upperFirst(text: string) {

        if (text === '') {
            return text;
        }

        return text[0].toUpperCase() + text.substring(1);

    }

    export function truncate(text: string,
                             length: number,
                             useEllipsis: boolean = true) {

        if (text.length < length) {
            // we don't need to truncate.
            return text;
        }

        const truncated = text.substring(0, length);

        if (useEllipsis) {
            return truncated + ' ...';
        } else {
            return truncated;
        }

    }

    export function truncateOnWordBoundary(text: string,
                                          length: number,
                                          useEllipsis: boolean = true) {

        if (text.length < length) {
            // we don't need to truncate.
            return text;
        }

        const truncated = text.substring(0, length);

        const end = truncated.lastIndexOf(' ');

        if (end > -1) {

            const truncatedOnBoundary = truncated.substring(0, end);

            if (useEllipsis) {
                return truncatedOnBoundary  + ' ...';
            }

            return truncatedOnBoundary;

        }

        return truncated;

    }

    /**
     * Regular expression for finding a whitespace char.
     */
    export const WHITESPACE_REGEX = '[ \f\r\n\v\t\u00A0\u2028\u2029]';

    /**
     * Return true if the given character is whitespace.
     *
     */
    export function isWhitespace(c: string[1]) {

        if (c.length === 0) {
            throw new Error("String is empty");
        }

        if ([...c].length > 1) {
            // TODO: only one character works. If it's longer than one character
            // this will break
            throw new Error(`String too long: '${c}'`);
        }

        switch (c) {

            case ' ':      // basic space
            case '\f':     // form feed
            case '\r':     // return
            case '\n':     // newline
            case '\v':     // vertical tab
            case '\t':     // tab
            case '\u00A0': // this maps to nbsp
            case '\u2028': // unicode 'line separator'
            case '\u2029': // unicode 'paragraph separator'
                return true;
            default:
                return false;
        }

    }

}

/**
 * A plain text string (not an HTML string) with all HTML stripped.
 */
export type PlainTextStr = string;

/**
 * A plain text string (not an HTML string) with all HTML stripped.
 */
export type TextStr = string | PlainTextStr;

export type MarkdownStr = string;

export type HTMLStr = string;

/**
 * A string representing a URL (file URL or HTTP URL or blob URL)
 */
export type URLStr = string;

/**
 * A string representing a local file path.
 */
export type PathStr = string;

/**
 * A string which can contain a URL or a path.  Anything without a scheme
 * prefix is assumed to be a path.
 */
export type PathOrURLStr = string;

/**
 * An ID string is a string representing a unique ID like a database
 * key or hashcode designed to be unique and not human readable.
 */
export type IDStr = string;

/**
 * Semantics of an IDStr but designed to be readable like a URI, token, etc.
 */
export type ReadableIDStr = IDStr;

/**
 * An email address string.
 */
export type EmailStr = string;

/**
 * A string formatted as a DOI 10.1038/nature12373
 */
export type DOIStr = string;

/**
 * String of JSON data.
 */
export type JSONStr = string;

export type DataURLStr = string;
