// Simple logger that meets the requirements we have for Polar.

import {Callers} from './Callers';
import {LoggerDelegate} from './LoggerDelegate';
import {ILogger} from './ILogger';

export class Logger {

    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    public static create() {
        const caller = Callers.getCaller();
        if (caller.filename === 'Logger.js') {
            throw new Error("Wrong caller: " + caller.filename);
        }

        return new DelegatedLogger(caller.filename);
    }

}

/**
 * Allows us to swap in delegates at runtime on anyone who calls create()
 * regardless of require() order.
 */
class DelegatedLogger implements ILogger {

    /**
     * The caller for this logger.
     */
    public caller: string;

    public readonly name: string = 'delegated';

    public constructor(caller: string) {
        this.caller = caller;
    }

    // TODO: spectron doesn't properly handle objects passed here but I don't
    // think we should compromise on our design.  We should fix the problem
    // with spectron instead of hacking it here.

    public notice(msg: string, ...args: any[]) {
        this.apply(LoggerDelegate.get().notice.bind(LoggerDelegate.get()), msg, ...args);
    }

    public info(msg: string, ...args: any[]) {
        this.apply(LoggerDelegate.get().info.bind(LoggerDelegate.get()), msg, ...args);
    }

    public warn(msg: string, ...args: any[]) {
        this.apply(LoggerDelegate.get().warn.bind(LoggerDelegate.get()), msg, ...args);
    }

    public error(msg: string, ...args: any[]) {
        this.apply(LoggerDelegate.get().error.bind(LoggerDelegate.get()), msg, ...args);
    }

    public verbose(msg: string, ...args: any[]) {
        this.apply(LoggerDelegate.get().verbose.bind(LoggerDelegate.get()), msg, ...args);
    }

    public debug(msg: string, ...args: any[]) {
        this.apply(LoggerDelegate.get().debug.bind(LoggerDelegate.get()), msg, ...args);
    }

    public async sync(): Promise<void> {
        return await LoggerDelegate.get().sync();
    }

    /**
     *
     */
    private apply(logFunction: LogFunction, msg: string, ...args: any[]) {

        // msg = "[" + this.caller + "] " + msg;

        msg = `[${this.caller}] ${msg}`;

        if (args.length > 0) {
            logFunction(msg, ...args);
        } else {
            // don't pass 'args' as electron-logger will print [] if the args
            // is zero which isn't helpful and is in fact confusing
            logFunction(msg);
        }

    }

}

type LogFunction = (msg: string, ...args: any[]) => void;
