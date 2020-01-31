import {ILogger} from './ILogger';
import {ConsoleLogger} from './ConsoleLogger';

export class LoggerDelegate {

    private static delegate: ILogger = new ConsoleLogger();

    public static set(delegate: ILogger) {
        this.delegate = delegate;
    }

    public static get(): ILogger {
        return this.delegate;
    }

}
