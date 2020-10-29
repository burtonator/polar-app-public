import {isPresent} from "../Preconditions";

/**
 * Simple tracer that uses log.time and can also return values...
 */
export namespace Tracer2 {

    /**
     * Logger implementation so we can change this any time we want.
     */
    export interface TracerLogger {
        readonly info: (msg: string) => void;
        readonly warn: (msg: string) => void;
    }

    export type TracerDelegate<T> = () => T;

    export type TracerExecutor = <T>(delegate: TracerDelegate<T>) => void;

    const WARN_THRESHOLD = 125;

    function isPromise<T>(value: any): value is Promise<T> {
        return isPresent(value.then);
    }
    //
    // function createTimer(id: string): Timer {
    //
    //     const before = Date.now();
    //
    //     return {
    //         stop: () => {
    //             const after = Date.now();
    //             const duration = after - before;
    //             if (duration > WARN_THRESHOLD) {
    //                 console.warn(`Slow task ${id}: `, duration);
    //             }
    //         }
    //     }
    // }

    function now(): number {
        if (typeof performance !== 'undefined') {
            return performance.now();
        } else {
            return Date.now();
        }
    }


    function handleCompletion(start: number, end: number) {
        const duration = end - start;
        if (duration > WARN_THRESHOLD) {
            console.warn(`FIXME id operation took too long: ${duration}ms`);
        }
    }

    /**
     * Creates a tracer with a given ID
     * FIXME: this can return T or Promise<T> which is wrong.
     */
    export function create() {

        return <T>(delegate: () => T) => {
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
