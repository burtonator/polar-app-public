/**
 * Logging interface.
 */
export interface ILogger {

    /**
     * The name of this logger for debug purposes.
     */
    readonly name: string;

    /**
     * A notice level message is always sent.  Regardless of log level.  We use
     * these for important states of the application that should always be
     * shown to the user.
     */
    notice(msg: string, ...args: any[]): void;

    error(msg: string, ...args: any[]): void;

    warn(msg: string, ...args: any[]): void;

    info(msg: string, ...args: any[]): void;

    verbose(msg: string, ...args: any[]): void;

    debug(msg: string, ...args: any[]): void;

    // /**
    //  * Trace an operation and always log the duration.  This is similar to
    //  * console time and timeEnd but we print when the operation starts too
    //  * and include a '...done' suffix included with the duration.
    //  */
    // trace(name: string, ...args: any[]): void;
    // traceEnd(name: string, ...args: any[]): void;

    sync(): Promise<void>;

}

// export abstract class BaseLogger implements ILogger {
//
//     private _traceName: string = "";
//     private _traceStart: number = 0;
//
//     readonly abstract name: string;
//
//     public abstract debug(msg: string, ...args: any[]): void;
//     public abstract error(msg: string, ...args: any[]): void;
//     public abstract info(msg: string, ...args: any[]): void;
//     public abstract notice(msg: string, ...args: any[]): void;
//     public abstract sync(): Promise<void>;
//     public abstract verbose(msg: string, ...args: any[]): void;
//     public abstract warn(msg: string, ...args: any[]): void;
//
//     public trace(name: string, ...args: any[]): void {
//         this._traceName = name;
//         this._traceStart = Date.now();
//
//         console.info(name, ...args);
//     }
//
//     public traceEnd(name: string, ...args: any[]): void {
//
//         const duration = Date.now() - this._traceStart;
//         const msg = `${name}...done ${duration}ms`;
//         console.info(msg, ...args);
//
//     }
//
//
// }
