/* tslint:disable:no-console */

/**
 * Record all messages written to the console.
 *
 * This is a bit more invasive but we have the ability to record errors recorded
 * by the browser this way.
 */
export namespace ConsoleRecorder {

    export type LogLevel = 'debug' | 'info' | 'error' | 'warn'

    export let messages: IConsoleMessage[] = [];

    export interface IConsoleMessage {
        readonly level: LogLevel;
        readonly message?: any;
        readonly params?: any;
    }

    const delegates = {
        debug: console.debug,
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    };

    export function start() {

        messages = [];

        function recordMessage(level: LogLevel, message: any, ...optionalParams: any[]) {
            messages.push({level, message, params: optionalParams});
        }

        console.debug = (message: any, ...optionalParams: any[]) => {
            recordMessage('debug', message, ...optionalParams);
            delegates.debug(message, ...optionalParams);
        }

        console.log = (message: any, ...optionalParams: any[]) => {
            recordMessage('info', message, ...optionalParams);
            delegates.log(message, ...optionalParams);
        }

        console.info = (message: any, ...optionalParams: any[]) => {
            recordMessage('info', message, ...optionalParams);
            delegates.info(message, ...optionalParams);
        }

        console.warn = (message: any, ...optionalParams: any[]) => {
            recordMessage('warn', message, ...optionalParams);
            delegates.warn(message, ...optionalParams);
        }

        console.error = (message: any, ...optionalParams: any[]) => {
            recordMessage('error', message, ...optionalParams);
            delegates.error(message, ...optionalParams);
        }

    }

    export function stop() {

        console.debug = delegates.debug;
        console.log = delegates.log;
        console.info = delegates.info;
        console.warn = delegates.warn;
        console.error = delegates.error;

        clear();

    }

    export function clear() {
        messages.slice();
    }

    export function snapshot(): ReadonlyArray<IConsoleMessage> {
        return [...messages]
    }

}