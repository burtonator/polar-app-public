import {createSiblings} from "polar-shared/src/util/Functions";
import {Char, Strings} from "polar-shared/src/util/Strings";
import {arrayStream, ScanTuple} from "polar-shared/src/util/ArrayStreams";
import {PointerType} from "./IPointer";

export interface CharPointer {

    /**
     * A single character
     */
    readonly value: string;

    /**
     * The offset into the string.
     */
    readonly offset: number;

    /**
     * True if this is whitespace.
     */
    readonly whitespace: boolean;

    readonly type: PointerType;

}

// FIXME: another issue , what if a DOM node has redundant white-text ... we would
// also have to strip that... so maybe the best solution is to pre-process and
// store some sort of 'padding' or 'ignore directive?  otherwise if we try to
// search for <b>hello    world</b> it won't work because there is too much
// spacing there...
//
// FIXME: another thing we have to be careful of is that duplicate whitespace
// should NOT yield a highlight break.

export class CharPointers {

    /**
     * Collapse duplicate whitespace
     */
    public static collapse(text: string) {
        return this.merge(this.toArray(text));
    }

    /**
     * @VisibleForTesting
     */
    public static toArray(text: string): ReadonlyArray<CharPointer> {

        // FIXME: the idea here is to build fast scanning predicates... these
        // two will know if the string is a prefix or suffix / ending

        type ScanDirection = 'start' | 'end';

        function computeWhitespaceTerminator(text: string,
                                             direction: ScanDirection): number | undefined {

            function computeStartAndDelta() {

                switch(direction) {
                    case "start":
                        return [0, 1];
                    case "end":
                        return [text.length -1, -1];
                }

            }

            const [start, delta] = computeStartAndDelta();

            function scanner(c: string, idx: number): ScanTuple<number> {
                const whitespace = Strings.isWhitespace(c);
                return [idx, ! whitespace];
            }

            return arrayStream(Array.from(text))
                    .scan(start, delta, scanner)
                    .first();

        }

        function createWhitespaceHandler(direction: ScanDirection) {

            const position = computeWhitespaceTerminator(text, 'start');

            return (idx: number): boolean => {

                if (position === undefined) {
                    return false;
                }

                switch (direction) {

                    case "start":
                        return idx < position;
                    case "end":
                        return idx > position;

                }

            }

        }

        function createWhitespacePrefixHandler() {
            return createWhitespaceHandler('start');
        }

        function createWhitespaceSuffixHandler() {
            return createWhitespaceHandler('end');
        }

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

        const whitespacePrefixHandler = createWhitespacePrefixHandler();
        const whitespaceSuffixHandler = createWhitespaceSuffixHandler();

        function toCharPointer(c: string, idx: number): CharPointer {

            function computeType(): PointerType {

                if (whitespacePrefixHandler(idx) ||
                    whitespaceSuffixHandler(idx) ||
                    isWhitespaceRun(idx)) {

                    return PointerType.ExcessiveWhitespace;

                }

                return PointerType.Literal;

            }

            const type = computeType();

            return {
                type,
                value: c,
                offset: idx,
                whitespace: Strings.isWhitespace(c)
            };

        }

        // TODO: I think we can then post-scan to find the whitespace prefix
        // txt.. and suffix text, and excessive padding ...

        return Array.from(text)
                    .map(toCharPointer)

    }

    /**
     * @VisibleForTesting
     */
    public static merge(pointers: ReadonlyArray<CharPointer>): ReadonlyArray<CharPointer> {

        return createSiblings(pointers)
                .filter(current => ! current.curr.whitespace || current.curr.whitespace !== current.next?.whitespace)
                .map(current => current.curr);

    }

}
