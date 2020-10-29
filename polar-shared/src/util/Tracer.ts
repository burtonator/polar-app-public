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

    export function sync<T>(delegate: () => T, id: string): T {

        const timer = createTimer(id);
        try {
            return delegate();
        } finally {
            timer.stop();
        }

    }


    export type AsyncDelegatePromise<T> = Promise<T>;
    export type AsyncDelegateFunction<T> = () => Promise<T>;

    export type AsyncDelegate<T> = AsyncDelegatePromise<T> | AsyncDelegateFunction<T>;

    /**
     * The idea about taking a promise directly is to just call the function
     * directly, have it return a promise, then this method hnndles it directly.
     */
    export async function async<T>(delegate: AsyncDelegate<T>, id: string): Promise<T> {

        function toPromise(): Promise<T> {

            if (typeof delegate === 'function') {
                return delegate();
            }

            return delegate;
        }

        const delegatePromise = toPromise();

        const timer = createTimer(id);

        try {
            return await delegatePromise;
        } finally {
            timer.stop();
        }
    }

}
