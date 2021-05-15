export namespace Asserts {

    export function assertDefined<T>(val: T | undefined): asserts val is T {
        if (val === undefined) {
            throw new Error("val is undefined");
        }
    }

    export function assertNotNull<T>(val: T | null): asserts val is T {
        if (val === null) {
            throw new Error("val is null");
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

    export function assertNumber<T>(val: any): asserts val is number {

        if (typeof val !== 'number') {
            throw new Error("val is not a number: " + (typeof val));
        }

    }

    export function assertString<T>(val: any): asserts val is string {

        if (typeof val !== 'string') {
            throw new Error("val is not a string: " + (typeof val));
        }

    }

    export function assertObject<T>(val: any): asserts val is object {

        if (typeof val !== 'object') {
            throw new Error("val is not a object: " + (typeof val));
        }

    }


}

