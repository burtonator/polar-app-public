import {Callback} from "./Functions";

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
                           opts: DebouncerOpts = {interval: 250}) {

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

}



