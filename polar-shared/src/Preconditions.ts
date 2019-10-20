import {NULL_FUNCTION} from './util/Functions';

export class Preconditions {

    /**
     *
     * @param value  The value we're trying to assert.
     *
     * @param testFunction Assert that the test function returns true
     * @param message
     * @return Return the value we've been given once it's passed assertions.
     */
    public static assert<T>(value: T, testFunction: AssertionFunction<T>, message: string): T {

        Preconditions.assertNotNull(testFunction, "testFunction");

        const result = testFunction(value);

        if (!result) {
            throw new Error(`Assertion failed for value ${value}: ` + message);
        }

        return value;

    }

    /**
     * Assert that this value is defined , not-null, and also not NaN and also a
     * number.
     *
     */
    public static assertEqual<T>(value: T, expected: T, name: string): T {

        if (value !== expected) {
            throw new Error(`Value of ${value} !==- ${expected}`);
        }

        return value;

    }

    /**
     * Assert that this value is defined , not-null, and also not NaN and also
     * a number.
     * @param value The value we expect to be a number.
     * @param name The name of the number.
     * @return {number}
     */
    public static assertNumber(value: any, name: string) {

        Preconditions.assertNotNull(value, name);

        if (isNaN(value)) {
            throw new Error(`Precondition failure for ${name}: NaN`);
        }

        Preconditions.assertTypeOf(value, "number", name);

        return value;

    }

    /**
     *
     * @param value {*}
     * @param instance {class}
     * @param name
     * @return {*}
     */
    public static assertInstanceOf(value: any, instance: any, name: string) {

        Preconditions.assertNotNull(value, name);
        Preconditions.assertNotNull(instance, "instance");

        if (! (value instanceof instance)) {
            throw new Error(`Precondition for instanceof '${name}' was not ${instance.name}.`);
        }

        return value;

    }

    public static assertString(value: any, name: string): string {
        return this.assertTypeOf(value, 'string', name);
    }

    /**
     *
     * @param value
     * @param type
     * @param name
     * @return value
     */
    public static assertTypeOf(value: any, type: string, name: string, handler: () => void = NULL_FUNCTION): any {

        if (typeof value !== type) {

            handler();

            const toValueType = () => {

                if (value === null) {
                    return "null";
                }

                if (value === undefined) {
                    return "undefined";
                }

                return typeof value;

            };

            const valueType = toValueType();

            throw new Error(`Precondition for typeof '${name}' was not ${type} but actually: ` + valueType);

        }

        return value;

    }

    /**
     * @deprecated Use assertPresent instead
     */
    public static assertNotNull<T>(value: T | null, name?: string): NonNullable<T> {
        return Preconditions.assertPresent(value, name);
    }


    // TODO: support a dict so that instead of specifying a name we can just
    // pass {name} since this is mostly a redundant param.
    public static assertPresent<T>(value: T | null, name?: string): NonNullable<T> {

        let msgPrefix = "Precondition argument failed: ";

        if (name) {
            msgPrefix = `Precondition (argument) for '${name}' failed`;
        }

        if (value === null) {
            throw new Error(`${msgPrefix}: null`);
        }

        if (value === undefined) {
            throw new Error(`${msgPrefix}: undefined`);
        }

        return value!;

    }

    public static assertAbsent<T>(value: T) {

        if (! isPresent(value)) {
            return;
        }

        if (value instanceof Error) {
            throw value;
        }

        throw new Error("Not absent: " + value);

    }

    public static assertNotTypeOf<T>(value: any, name: string, type: string): T {

        if (typeof value === type ) {
            throw new Error(`Precondition for typeof '${name}' was ${type} but not allowed`);
        }

        return value;

    }

    public static assertNotInstanceOf<T>(value: T, name: string, instance: any): T {

        if (value instanceof instance) {
            throw new Error(`Precondition for instanceof '${name}' was ${instance} but not allowed`);
        }

        return value;

    }

    /**
     * Use a default value if one is not specified.  This works better than
     * other tests which error when working with undefined | null and booleans
     * as these are false-ish.
     *
     */
    public static defaultValue<T>(value: T | undefined | null, defaultValue: T): NonNullable<T> {

        if (isPresent(value)) {
            return value!;
        }

        return defaultValue!;

    }

    /**
     * Return true if the given value is present. Not undefined and not null.
     *
     * @param val
     */
    public static isPresent(val: any): boolean {
        return val !== undefined && val !== null;
    }

}

type AssertionFunction<T> = (val: T) => boolean;

// noinspection TsLint: variable-name
export function defaultValue<T>(value: T | undefined | null, defaultValue: T): NonNullable<T> {
    return Preconditions.defaultValue(value, defaultValue);
}

export function notNull<T>(value: T | null, name?: string): NonNullable<T> {
    return Preconditions.assertNotNull(value, name);
}

export function isPresent(val: any): boolean {
    return Preconditions.isPresent(val);
}

