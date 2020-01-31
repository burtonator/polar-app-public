/**
 * Represents a Result of some computation that usually needs to be represented
 * as either a value or an error.  We often use these for RPC / IPC.
 */
export interface IResult<T> {

    readonly value?: T;

    readonly err?: Error;

}

export class Result<T> implements IResult<T> {

    public readonly value?: T;

    public readonly err?: Error;

    constructor(opts: IResult<T>) {
        this.value = opts.value;
        this.err = opts.err;
    }

    public hasValue(): boolean {
        return this.value !== undefined;
    }

    public get(): T {

        if (this.value !== undefined) {
            return this.value;
        }

        throw this.err!;

    }

    public toJSON(): any {

        if (this.value !== undefined) {

            return {
                value: this.value
            };

        } else if (this.err !== undefined) {

            return {
                err: {
                    name: this.err.name,
                    message: this.err.message,
                    stack: this.err.stack
                }
            };

        } else {
            throw new Error("Neither value nor err");
        }

    }

}
