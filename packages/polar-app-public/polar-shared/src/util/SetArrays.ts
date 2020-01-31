/**
 * Set theoretic operations for Typescript arrays.
 */
import {Arrays, PrimitiveArray} from "./Arrays";
import {Sets} from "./Sets";

export class SetArrays {

    /**
     * Difference (a \ b): create a set that contains those elements of set a
     * that are not in set b
     *
     */
    public static difference<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): ReadonlyArray<T> {
        return a.filter(x => ! b.includes(x));
    }

    /**
     * Compute a union of all the given sets.
     */
    public static union<T>(...arrays: ReadonlyArray<ReadonlyArray<T>>): ReadonlyArray<T> {

        const set = new Set<T>();

        for (const arr of arrays) {
            arr.forEach( current => set.add(current));
        }

        return Array.from(set);

    }

    public static intersection<T>(left: ReadonlyArray<T>, right: ReadonlyArray<T>): ReadonlyArray<T> {

        const a = new Set(left);
        const b = new Set(right);

        const intersection = new Set(
            [...a].filter(x => b.has(x)));

        return Array.from(intersection);

    }

    /**
     * Return true if the two sets intersect.  This is faster than computing
     * the full intersection as we will terminate faster (on the first match).
     */
    public static intersects<T>(left: ReadonlyArray<T>, right: ReadonlyArray<T>): boolean {

        for (const val of left) {

            if (right.includes(val)) {
                return true;
            }

        }

        return false;

    }

    /**
     * Make sure the array has all unique values (IE is a set).
     */
    public static unique<T>(values: ReadonlyArray<T>) {
        return Sets.toArray(SetArrays.toSet(values));
    }

    public static toSet<T>(arr: ReadonlyArray<T>): Set<T> {

        const set = new Set<T>();

        arr.forEach(current => set.add(current));

        return set;

    }

    /**
     * Return true if these arrays are the same.
     */
    public static equal(a: PrimitiveArray, b: PrimitiveArray) {
        const _a = [...a].sort();
        const _b = [...b].sort();
        return Arrays.equal(_a, _b);
    }

}
