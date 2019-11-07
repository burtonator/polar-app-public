export class ClozeParser {

    public static parse(input: string): ReadonlyArray<ClozeRegion> {

        const regex = /{{c([0-9]+)::(.*?)}}/g;
        const matches = this.matches(input, regex);

        const toCloze = (match: RegExpExecArray) => {

            const id = parseInt(match[1]);
            const occluded = match[2];
            const offset = match.index;
            const length = match[0].length;

            const cloze: ClozeRegion = {
                id, occluded, offset, length,
                type: 'cloze'
            };

            return cloze;

        };

        return matches.map(current => toCloze(current));

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
    readonly offset: number;
    readonly length: number;
    readonly type: RegionType;
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
    readonly occluded: string;

}
