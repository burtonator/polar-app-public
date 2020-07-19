import {PointerType} from "./IPointer";
import {Whitespace} from "./Whitespace";

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

        const whitespacePredicate = Whitespace.createWhitespacePredicate(text);

        function toCharPointer(c: string, idx: number): CharPointer {

            function computeType(): PointerType {

                if (whitespacePredicate(idx)) {
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
