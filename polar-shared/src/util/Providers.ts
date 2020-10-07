import {DurationStr, TimeDurations} from "./TimeDurations";
import {Latch} from "./Latch";

/**
 * A literal value or a provider value.
 */
export type LiteralOrProvider<T> = T | Provider<T>;

/**
 * A Provider is just a function that returns a given type.
 */
export type Provider<T> = () => T;

/**
 * A provider that can be used as an interface.
 */
export interface IProvider<T> {
    get(): T;
}

export class Providers {

    /**
     * Get the value of a literal or the provider directly.
     * @param value
     */
    public static toValue<T>(value: LiteralOrProvider<T>): T {

        if (typeof value === 'function') {
            return (<any> value)();
        }

        return value;

    }

    /**
     * Convert a provider interface to a function.
     */
    public static toFunction<T>(provider: IProvider<T>) {
        return () => provider.get();
    }

    public static toInterface<T>(provider: Provider<T> | T): IProvider<T> {

        const toFunction = (): Provider<T> => {

            if (typeof provider !== 'function') {
                return () => provider;
            }

            return <Provider<T>> provider;

        };

        const func = toFunction();

        return {
            get() {
                return func();
            }
        };

    }

    /**
     * Return a provider using the given value.
     */
    public static of<T>(value: T): Provider<T> {
        return () => value;
    }

    /**
     * Memoize the given function to improve its performance or make it
     * optional.
     */
    public static memoize<T>(provider: Provider<T>): Provider<T> {

        let memoized: boolean = false;

        // an error that the provider threw
        let err: Error | undefined;

        // the value that the provider returned.
        let memo: T | undefined;

        return () => {

            if (memoized) {

                if (err) {
                    throw err;
                }

                return memo!;

            }

            try {

                memo = provider();
                return memo!;

            } catch (e) {
                err = e;
                throw e;
            } finally {
                memoized = true;
            }

        };

    }

    /**
     * Cache the given function to avoid continually fetching the underlying
     * value.
     */
    public static cached<T>(duration: DurationStr,
                            provider: Provider<T>): Provider<T> {

        const durationMS = TimeDurations.toMillis(duration);

        let lastUpdated: number = 0;

        // an error that the provider threw
        let err: Error | undefined;

        // the value that the provider returned.
        let value: T | undefined;

        return () => {

            if (Date.now() - lastUpdated < durationMS) {

                if (err) {
                    throw err;
                }

                return value!;

            }

            try {

                value = provider();
                return value!;

            } catch (e) {
                err = e;
                throw e;
            } finally {
                lastUpdated = Date.now();
            }

        };

    }


}

export type AsyncProvider<T> = () => Promise<T>;

export class AsyncProviders {

    public static of<T>(value: T): AsyncProvider<T> {
        return () => Promise.resolve(value);
    }

    public static memoize<T>(provider: AsyncProvider<T>): AsyncProvider<T> {

        const latch: Latch<T> = new Latch();

        // true when the first provider is executing.
        let executing: boolean = false;

        return async () => {

            if (executing) {
                // if we're executing we just return the latch and it will block
                // until the first caller returns.
                return latch.get();
            }

            try {

                executing = true;
                const result = await provider();
                latch.resolve(result);
                return result;

            } catch (e) {
                latch.reject(e);
                throw e;
            }

        };

    }

    public static memoize1<A, T>(provider: (arg0: A) => Promise<T>): (arg0: A) => Promise<T>  {

        const latch: Latch<T> = new Latch();

        // true when the first provider is executing.
        let executing: boolean = false;

        return async (arg0: A) => {

            if (executing) {
                // if we're executing we just return the latch and it will block
                // until the first caller returns.
                return latch.get();
            }

            try {

                executing = true;
                const result = await provider(arg0);
                latch.resolve(result);
                return result;

            } catch (e) {
                latch.reject(e);
                throw e;
            }

        };
    }

}
