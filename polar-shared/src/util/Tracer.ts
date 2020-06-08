/* tslint:disable:no-console */
/**
 * Simple tracer that uses log.time and can also return values...
 */
export namespace Tracer {

    const WARN_THRESHOLD = 125;

    interface Timer {
        stop: () => void;
    }

    function createTimer(id: string): Timer {
        const before = Date.now();

        return {
            stop: () => {
                const after = Date.now();
                const duration = after - before;
                if (duration > WARN_THRESHOLD) {
                    console.warn(`Slow task ${id}: `, duration);
                }
            }
        }
    }

    export function sync<T>(id: string, delegate: () => T): T {
        const timer = createTimer(id);
        try {
            return delegate();
        } finally {
            timer.stop();
        }
    }

    export async function async<T>(id: string, delegate: Promise<T>): Promise<T> {
        const timer = createTimer(id);
        try {
            return await delegate;
        } finally {
            timer.stop();
        }
    }

    export async function execAsync<T>(id: string, delegate: () => Promise<T>): Promise<T> {
        return await async(id, delegate());
    }


}
