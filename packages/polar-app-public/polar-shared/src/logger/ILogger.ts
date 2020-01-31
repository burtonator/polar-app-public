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

    sync(): Promise<void>;

}

