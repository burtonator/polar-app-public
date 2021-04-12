export namespace Asserts {

    export function assertDefined<T>(val: T | undefined): asserts val is T {
        if (val === undefined) {
            throw new Error("val is undefined");
        }
    }

    export function assertPresent<T>(val: T | null | undefined): asserts val is T {

        if (val === null) {
            throw new Error("val is null");
        }

        if (val === undefined) {
            throw new Error("val is undefined");
        }

    }

}

