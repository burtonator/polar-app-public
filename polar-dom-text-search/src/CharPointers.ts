import {Strings} from "polar-shared/src/util/Strings";
import {PointerType} from "./IPointer";
import {WhitespaceHandlers} from "./WhitespaceHandlers";

export interface CharPointer {

    /**
     * A single character
     */
    readonly value: string;

    /**
     * The offset into the string.
     */
    readonly offset: number;

    readonly type: PointerType;

}

export namespace CharPointers {

    export function parse(text: string): ReadonlyArray<CharPointer> {

        /**
         * True if the current character is a run of whitespace. At least two
         * whitespace characters in a row.
         */
        function isWhitespaceRun(idx: number): boolean {

            if (idx === 0) {
                return false;
            }

            return Strings.isWhitespace(text[idx - 1]) && Strings.isWhitespace(text[idx]);

        }

        const whitespacePredicate = WhitespaceHandlers.createWhitespacePredicate(text);

        function toCharPointer(c: string, idx: number): CharPointer {

            function computeType(): PointerType {

                if (whitespacePredicate(idx) || isWhitespaceRun(idx)) {
                    return PointerType.ExcessiveWhitespace;
                }

                return PointerType.Literal;

            }

            const type = computeType();

            return {
                type,
                value: c,
                offset: idx,
            };

        }

        // TODO: I think we can then post-scan to find the whitespace prefix
        // txt.. and suffix text, and excessive padding ...

        return Array.from(text)
                    .map(toCharPointer)

    }

}
