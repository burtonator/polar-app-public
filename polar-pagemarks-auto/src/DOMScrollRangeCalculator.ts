export type CSSSelector = string;

export interface RangeIDs {
    readonly container: CSSSelector;
    readonly box: CSSSelector;
}

export class DOMScrollRangeCalculator {

    public static compute(ranges: RangeIDs) {

        const container = document.querySelector(ranges.container);

        // comute the scroll offsets.
        // then compute it relative to the parent..

    }

}
