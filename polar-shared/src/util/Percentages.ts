/**
 * A percentage with the interval [0,1]
 */
export type Percentage1 = number;

/**
 * A percentage with the interval [0,100]
 */
export type Percentage100 = number;

export class Percentages {

    /**
     * Compute a *safe* sum of percentage.  Due to floating point issues it
     * might be possible to be slightly greater than 100 so round down.
     *
     * Otherwise just return a sum.
     *
     * @param percentages
     */
    public static sum(...percentages: number[]) {

        let sum = 0;

        for (const current of percentages) {
            sum += current;
        }

        // technically this can go the other way too...

        if (sum > 100 && sum < 100.1) {
            return 100;
        }

        return sum;

    }

    public static calculate(value: number,
                            total: number,
                            opts: CalculateOpts = {}): Percentage100 {

        if (value > total) {
            throw new Error(`value ${value} is greater than total ${total}`);
        }

        const raw = 100 * (value / total);

        if (opts.noRound) {
            return raw;
        }

        return Percentages.round(raw);
    }

    public static round(perc: number): Percentage100 {
        return Math.round(perc * 100) / 100;
    }

}

export function round(perc: number) {
    return Percentages.round(perc);
}

interface CalculateOpts {
    readonly noRound?: boolean;
}
