import {Strings} from "./Strings";

export namespace Whitespace {

    export function canonicalize(text: string) {
        return [...text]
            .map(current => Strings.isWhitespace(current) ? ' ' : current)
            .join('');
    }

}
