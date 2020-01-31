import {isPresent} from '../../Preconditions';

/**
 * A function that provides us with a value.
 */
export type ValueFunction<T> = () => NotFunction<T> | null | undefined;

// https://stackoverflow.com/questions/24613955/is-there-a-type-in-typescript-for-anything-except-functions
// tslint:disable-next-line:ban-types
type NotFunction<T> = T extends Function ? never : T;

/**
 * Provides us with a value that we're looking for directly.  Either the literal
 * value or an optional or null or undefined (when it's missing).  When
 * we are using a function we might actually be faster as the function might
 * not be invoked when we return fast.
 */
export type ValueReference<T> = NotFunction<T> | null | undefined | Optional<NotFunction<T>> | ValueFunction<T>;

export class Optional<T> {

    constructor(value: T | undefined | null, name?: string) {
        this.value = value;
        this.name = name;
    }

    /**
     * An name for this Optional which can be used when generating errors.
     */
    public readonly name?: string = undefined;

    private readonly value: T | null | undefined = undefined;

    public map<V>(mapFunction: MapFunction<NonNullable<T>, V>): Optional<NonNullable<V>> {

        if (this.isPresent()) {

            const mapped = mapFunction(this.value!);

            if (Optional.present(mapped)) {
                return new Optional<NonNullable<V>>(mapped!, this.name);
            }

        }

        return new Optional<NonNullable<V>>(undefined, this.name);

    }

    public when(consumeFunction: ConsumeFunction<NonNullable<T>>) {

        if (this.isPresent()) {
            consumeFunction(this.value!);
        }

    }

    public filter(filterFunction: FilterFunction<NonNullable<T>>): Optional<T> {

        if (this.isPresent() && filterFunction(this.value!)) {
            return new Optional(this.value);
        }

        return new Optional<T>(undefined, this.name);

    }

    public get(): NonNullable<T> {

        if (this.isPresent()) {
            return this.value!;
        } else {
            throw new Error("The value is undefined");
        }

    }

    public getOrElse(value: NonNullable<T>): NonNullable<T> {

        if (this.isPresent()) {
            return this.value!;
        }

        return value;
    }

    /**
     * Get the value or return undefined if it is absent.
     */
    public getOrUndefined(): T | undefined {

        if (! this.isPresent()) {
            return undefined;
        }

        return this.value!;
    }

    /**
     * Get the value or return null if it is absent.
     */
    public getOrNull(): T | null {

        if (! this.isPresent()) {
            return null;
        }

        return this.value!;
    }

    public getOrThrow(cause: string | Error): T {

        if (! this.isPresent()) {

            if (typeof cause === 'string') {
                throw new Error(cause);
            }

            throw cause;

        }

        return this.value!;
    }

    public isPresent(): boolean {
        return this.value !== undefined && this.value !== null;
    }


    /**
     *
     * @see {validateTypeof}
     */
    public validateString(): Optional<string> {

        return this.validateTypeof('string')
            .map(current => current as any);

    }

    /**
     *
     * @see {validateTypeof}
     */
    public validateBoolean(): Optional<boolean> {

        return this.validateTypeof('boolean')
            .map(current => current as any);

    }

    /**
     *
     * @see {validateTypeof}
     */
    public validateNumber(): Optional<number> {

        return this.validateTypeof('number')
            .map(current => current as any);

    }

    /**
     * Convert this to an 'any' type.  This is helpful in some situations as
     * Typescript doesn't like forced typing of generified types like
     * NonNullable and calling a simple method like toAny is cleaner than
     * doing a map in your code.
     */
    public toAny(): Optional<any> {
        return this.map(current => current as any);
    }

    /**
     * Validate the 'typeof' the value. This is helpful when we have an unsafe
     * data source like a JSON decoder where have a Typescript declared type of
     * X but the JSON decoder pulled out type Y.  This way we can guard the value
     * before we work with it and just return an empty Optional.
     *
     */
    public validateTypeof(typeOf: JavascriptType): Optional<T> {

        if (this.isPresent() && typeof this.value === typeOf) {
            return this;
        }

        return Optional.empty();

    }

    public static of<T>(value: T | null | undefined, name?: string): Optional<T> {
        return new Optional<T>(value, name);
    }

    /**
     * Get the first value in a set of values.  This is a common pattern and
     * we could use lodash or a stream-like API but it's a bit easier to just
     * do it this way.
     */
    public static first<T>(...values: ReadonlyArray<ValueReference<T>>): Optional<T> {

        for (const value of values) {

            let val: T | null | undefined;

            if (value instanceof Optional) {
                val = value.getOrUndefined();
            } else if (typeof value === 'function') {

                // for some reason type script is complaining that we can't
                // call the function. There must be some unusual type safety
                // issue here I can't identify but I'm testing this now.
                const valueFunction = <ValueFunction<T>> value;
                val = valueFunction();

            } else {
                val = value;
            }

            if (isPresent(val)) {
                return Optional.of(val);
            }

        }

        return Optional.empty();

    }

    public static empty<T>(name?: string): Optional<T> {
        return new Optional<T>(undefined, name);
    }

    /**
     * Return true if the given object is present.
     *
     */
    public static present(obj?: any) {
        return obj !== undefined && obj !== null;
    }

}

export class Defaults {

}

/**
 * Just consume a value with no need to return any result.
 */
export type ConsumeFunction<T> = (value: T) => void;

export type MapFunction<T, V> = (value: T) => V;

export type FilterFunction<T> = (value: T) => boolean;

export type JavascriptType = 'string' | 'number' | 'boolean' | 'object';
