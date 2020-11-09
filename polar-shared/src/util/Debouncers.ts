import {Callback, Callback1} from "./Functions";

export type DebouncerCallback = Callback;

/**
 * A task scheduler that only executes a task once every interval and replaces
 * the task that it should execute so that the most recent task is the one that
 * is executed (replacing stale tasks)
 */
export namespace Debouncers {

    export interface DebouncerOpts {
        readonly interval: number;
    }

    export function create(callback: Callback,
                           opts: DebouncerOpts = {interval: 100}): DebouncerCallback {

        let timeout: object | undefined;

        return () => {

            if (timeout) {
                // already scheduled
                return;
            }

            timeout = setTimeout(() => {
                callback();
                // now clear the timeout so we can schedule again
                timeout = undefined;
            }, opts.interval);

        };

    }

    /**
     * Create a debouncer with one argument.
     */
    export function create1<T>(callback: Callback1<T>,
                               opts: DebouncerOpts = {interval: 100}): Callback1<T> {

        let timeout: object | undefined;

        return (value) => {

            if (timeout) {
                // already scheduled
                return;
            }

            timeout = setTimeout(() => {
                callback(value);
                // now clear the timeout so we can schedule again
                timeout = undefined;
            }, opts.interval);

        };

    }

}



