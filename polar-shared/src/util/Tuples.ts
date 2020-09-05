import {Optional} from './ts/Optional';
import {Preconditions} from "../Preconditions";

export namespace Tuples {

    /**
     * Go over the array-like object and return tuples with prev, curr, and next
     * properties so that we can peek at siblings easily.  If the prev and / or
     * next are not present these values are null.
     *
     * This can be used for algorithms that need to peek ahead or behind
     * inside an iterative algorithm
     *
     */
    export function createSiblings<T>(arr: ReadonlyArray<T>): ReadonlyArray<ISibling<T>> {

        Preconditions.assertPresent(arr, "arr");

        function toSibling(value: T, idx: number): ISibling<T> {
            return {
                idx,
                curr: value,
                prev: Optional.of(arr[idx - 1]).getOrUndefined(),
                next: Optional.of(arr[idx + 1]).getOrUndefined()
            }
        }

        return arr.map(toSibling);

    }

}

/**
 * Represents a 'position' object for createSiblings() that has a curr
 * (current), prev (previous), and next references for working with lists of
 * objects.  The position allow sus to know where we currently are but also the
 * previous and future states.
 */
export interface ISibling<T> {

    readonly idx: number;

    readonly prev?: T;

    readonly curr: T;

    readonly next?: T;

}
