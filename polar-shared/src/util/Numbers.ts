import { Reducers } from "./Reducers";

export class Numbers {

    /**
     * Type guard to verify that the value given is always a number type.
     * @param value
     */
    public static toNumber(value: number | string): number {

        if (typeof value === 'string') {
            return parseInt(value);
        }

        return value;

    }

    public static sum(...values: number[]) {
        return values.reduce(Reducers.SUM, 0);
    }

    public static mean(...values: number[]) {

        if (values.length === 0) {
            return NaN;
        }

        const sum = Numbers.sum(...values);
        return sum / values.length;

    }

    public static compare(n0: number | undefined, n1: number | undefined) {

        if (n0 === undefined && n1 !== undefined) {
            return -1;
        }

        if (n0 === undefined && n1 === undefined) {
            return 0;
        }

        if (n0 !== undefined && n1 === undefined) {
            return 1;
        }

        return n0! - n1!;

    }

    public static range(start: number, end: number): ReadonlyArray<number> {

        const result = [];

        for (let idx = start; idx <= end; ++idx) {
            result.push(idx);
        }

        return result;

    }

    public static toFixedFloat(input: number, width: number): number {
        return parseFloat(input.toFixed(width));
    }

}
