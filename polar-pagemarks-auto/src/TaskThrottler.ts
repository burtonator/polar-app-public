/**
 * A task scheduler that only executes a task once every interval and replaces
 * the task that it should execute so that the most recent task is the one that
 * is executed (replacing stale tasks)
 */
import {Callback} from "polar-shared/src/util/Functions";

export class TaskThrottler {

    private pending: Callback | undefined;

    constructor(private interval: number) {

    }

    public schedule(task: Callback) {

        const noTask = ! this.pending;

        // update to the most frequent task...
        this.pending = task;

        if (noTask) {

            // no task so create a handler to execute and clear it.

            const handler = () => {
                this.pending!();
                this.pending = undefined;
            };

            setTimeout(() => handler(), this.interval);

        }

    }

}
