import { Reducers } from "./Reducers";

export namespace Numbers {

    /**
     * Type guard to verify that the value given is always a number type.
     * @param value
     */
    export function toNumber(value: number | string): number {

        if (typeof value === 'string') {
            return parseInt(value);
        }

        return value;

    }

    export function toString(value: number): string {
        return '' + value;
    }

    export function sum(...values: number[]) {
        return values.reduce(Reducers.SUM, 0);
    }

    export function max(...values: number[]) {

        let result = values[0];

        for (const value of values) {
            if (value > result) {
                result = value;
            }
        }

        return result;

    }

    export function mean(...values: number[]) {

        if (values.length === 0) {
            return NaN;
        }

        const sum = Numbers.sum(...values);
        return sum / values.length;

    }

    export function compare(n0: number | undefined, n1: number | undefined) {

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

    /**
     * Compute a list of number between start and end, inclusive over the
     * interval [start, end]
     */
    export function range(start: number, end: number): ReadonlyArray<number> {

        const result = [];

        for (let idx = start; idx <= end; ++idx) {
            result.push(idx);
        }

        return result;

    }

    export function isNumber(text: string) {
        return ! isNaN(parseInt(text));
    }

    export function toFixedFloat(input: number, width: number): number {
        return parseFloat(input.toFixed(width));
    }


    export function format(bytes: number): string {
        if (bytes < 1000) {
            return bytes +  "";
        } else if (bytes < 1000000) {
            return Math.floor(bytes / 1000) + " K";
        } else if (bytes < 1000000000) {
            return Math.floor(bytes / 1000000) + " M";
        } else if (bytes < 1000000000000) {
            return Math.floor(bytes / 1000000000) + " B";
        } else if (bytes < 1000000000000000) {
            return Math.floor(bytes / 1000000000000) + " T";
        }

        return bytes +  "";

    }

}
