/**
 * A task scheduler that only executes a task once ever interval and replaces the task that it should execute so that
 * the most recent task is the one that is executed (replacing stale tasks)
 */
import {Callback} from "polar-shared/src/util/Functions";

export class TaskScheduler {

    private pending: PendingTask | undefined;

    constructor(private interval: number) {
    }

    public schedule(task: Callback) {

        if (this.pending) {
            // update to the most frequent task...
            this.pending.task = task;
        } else {

            // no task so create a handler to execute and clear it.

            const handler = () => {
                this.pending!.task();
                this.pending = undefined;
            };

            setTimeout(() => handler(), this.interval);

        }

    }

}

class PendingTask {

    constructor(public task: Callback) {

    }

}
