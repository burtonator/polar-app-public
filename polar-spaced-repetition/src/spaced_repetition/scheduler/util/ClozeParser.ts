import {Tuples} from "polar-shared/src/util/Tuples";
import {Preconditions} from "polar-shared/src/Preconditions";

export class ClozeParser {

    public static toClozeRegions(input: string): ReadonlyArray<ClozeRegion> {

        const regex = /{{c([0-9]+)::(.*?)}}/g;
        const matches = this.matches(input, regex);

        const toCloze = (match: RegExpExecArray) => {

            const id = parseInt(match[1]);
            const occluded = match[2];
            const offset = match.index;
            const length = match[0].length;

            const cloze: ClozeRegion = {
                id, text: occluded, offset, length,
                type: 'cloze',
                subtype: 'none'
            };

            return cloze;

        };

        return matches.map(current => toCloze(current));

    }

    /**
     * Parse this out into 'regions' that can just be raw text too.
     */
    public static toRegions(input: string): ReadonlyArray<Region> {

        Preconditions.assertPresent(input, 'input');

        const clozeRegions = this.toClozeRegions(input);

        const computeFirstTextRegion = (curr: ClozeRegion) => {

            const offset = 0;
            const length = curr.offset;
            const text = input.substring(offset, offset + length);

            const textRegion: TextRegion = {
                type: 'text',
                subtype: 'first',
                text, offset, length
            };

            return textRegion;
        };

        const computeLastTextRegion = (curr: ClozeRegion) => {
            const offset = curr.offset + curr.length;
            const length = input.length - offset;
            const text = input.substring(offset, offset + length);

            const textRegion: TextRegion = {
                type: 'text',
                subtype: 'last',
                text, offset, length
            };
            return textRegion;
        };


        const computeMiddleTextRegion = (curr: ClozeRegion, next: ClozeRegion) => {
            const offset = curr.offset + curr.length;
            const length = next.offset - offset;
            const text = input.substring(offset, offset + length);
            const textRegion: TextRegion = {
                type: 'text',
                subtype: 'mid',
                text, offset, length
            };
            return textRegion;

        };

        if (clozeRegions.length === 0) {

            // TODO: if there is no first or last?

            const result: TextRegion = {
                type: 'text',
                subtype: 'full',
                text: input,
                offset: 0,
                length: input.length
            };

            return [result];
        }

        const result: Region[] = [];

        const tuples = Tuples.createSiblings(clozeRegions);

        for (const tuple of tuples) {

            if (! tuple.prev) {
                result.push(computeFirstTextRegion(tuple.curr));
            }

            result.push(tuple.curr);

            if (tuple.next) {
                result.push(computeMiddleTextRegion(tuple.curr, tuple.next));
            } else {
                result.push(computeLastTextRegion(tuple.curr));
            }

        }

        return result;

    }

    public static regionsToText(regions: ReadonlyArray<Region>): string {
        return regions.map(current => current.text).join('');
    }

    private static matches(text: string, re: RegExp): ReadonlyArray<RegExpExecArray> {

        let m;

        const matches: RegExpExecArray[] = [];

        do {
            m = re.exec(text);
            if (m) {
                matches.push(m);
            }
        } while (m);

        return matches;

    }

}

export type RegionType = 'text' | 'cloze';

export interface Region {

    /**
     * Offset in the parent.
     */
    readonly offset: number;

    /**
     * Length of the text in the parent.
     */
    readonly length: number;

    readonly type: RegionType;

    readonly subtype: string;

    /**
     * The text representation of this region as a substring of the parent.
     */
    readonly text: string;
}

/**
 * Just plain text.
 */
export interface TextRegion extends Region {
    readonly type: 'text';
}

export interface ClozeRegion extends Region{

    readonly type: 'cloze';

    /**
     * The cloze ID.  Normally starting at one (c1, c2, etc)
     */
    readonly id: number;

    /**
     * The occluded text that should be initially hidden.
     */
    readonly text: string;

}
