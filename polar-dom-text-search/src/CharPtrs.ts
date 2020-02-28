import {createSiblings} from "polar-shared/src/util/Functions";
import { Strings } from "polar-shared/src/util/Strings";

export interface CharPtr {

    /**
     * A single character
     */
    readonly value: string;

    /**
     * The offset into the string.
     */
    readonly index: number;

    /**
     * True if this is whitespace.
     */
    readonly whitespace: boolean;

}

export class CharPtrs {

    /**
     * Collapse duplicate whitespace
     */
    public static collapse(text: string) {
        return this.merge(this.toArray(text));
    }

    /**
     * @VisibleForTesting
     */
    public static toArray(text: string): ReadonlyArray<CharPtr> {

        const result: CharPtr[] = [];

        for (let idx = 0; idx < text.length; ++idx) {
            const c = text[idx];

            result.push({
                value: c,
                index: idx,
                whitespace: Strings.isWhitespace(c)
            });

        }

        return result;

    }

    /**
     * @VisibleForTesting
     */
    public static merge(pointers: ReadonlyArray<CharPtr>): ReadonlyArray<CharPtr> {

        return createSiblings(pointers)
            .filter(current => ! current.curr.whitespace || current.curr.whitespace !== current.next?.whitespace)
            .map(current => current.curr);

    }

}
