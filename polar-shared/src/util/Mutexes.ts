import {Latch} from "./Latch";

export class Mutexes {

    public static create() {
        return new Mutex();
    }

}

export class Mutex {

    private latch: Latch<boolean> | undefined = undefined;

    /**
     * Acquire a lock or wait for it to be released.
     */
    public async acquire() {

        while (this.latch) {
            await this.latch.get();
        }

        // return as we're now holding the latch
        this.latch = new Latch<boolean>();

    }

    /**
     * Execute the write within the mutex, automatically releasing it when completed.
     */
    public async execute<T>(func: () => Promise<T>) {

        try {
            await this.acquire();
            await func();
        } finally {
            this.release();
        }

    }

    public release() {
        this.latch!.resolve(true);
        this.latch = undefined;
    }

}
