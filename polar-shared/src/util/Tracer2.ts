import {isPresent} from "../Preconditions";

/**
 * Simple tracer that uses log.time and can also return values...
 */
export namespace Tracer2 {

    const THRESHOLD = 125;

    /**
     * A TracerFunction can be given either a delegate that returns a value
     * without await or a Promise.
     */
    export interface TracerFunction {
        <T>(delegate: () => T): T;
        <T>(delegate: () => Promise<T>): Promise<T>;
    }

    /**
     * Logger implementation so we can change this any time we want via a hook
     * or some other factory method.
     */
    export interface TracerLogger {
        readonly info: (msg: string) => void;
        readonly warn: (msg: string) => void;
    }

    function isPromise<T>(value: any): value is Promise<T> {
        return isPresent(value.then);
    }

    function now(): number {
        if (typeof performance !== 'undefined') {
            return performance.now();
        } else {
            return Date.now();
        }
    }

    interface CreateOpts {

        /**
         * The unique ID for this tracer.
         */
        readonly id: string;
        readonly threshold?: number;
        readonly logger?: TracerLogger;

    }

    /**
     * Creates a tracer with a given ID
     */
    export function create(opts: CreateOpts): TracerFunction {

        const {id} = opts;
        const threshold = opts.threshold || THRESHOLD;
        const logger = opts.logger || console;

        function handleCompletion(start: number, end: number) {
            const duration = end - start;
            if (duration > threshold) {
                logger.warn(`${id} operation took too long: ${duration}ms`);
            }
        }

        return <T>(delegate: () => T | Promise<T>) => {

            const start = now();
            const result = delegate();

            if (isPromise(result)) {

                return new Promise<T>((resolve, reject) => {

                    result.then(value => resolve(<any> value))
                          .catch(reject)
                          .finally(() => {
                              const end = now();
                              handleCompletion(start, end);
                          });
                });

            } else {
                const end = now();
                handleCompletion(start, end);
                return result;
            }

        }

    }

}
