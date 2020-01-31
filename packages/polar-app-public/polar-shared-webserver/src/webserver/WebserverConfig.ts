import {Preconditions} from 'polar-shared/src/Preconditions';
import {Rewrite} from "./Rewrites";

export class WebserverConfig implements IWebserverConfig {

    public readonly dir: string;

    public readonly port: number;

    public readonly host: string;

    public readonly useSSL?: boolean;

    public readonly ssl?: SSLConfig;

    public readonly rewrites?: ReadonlyArray<Rewrite>;

    constructor(dir: string, port: number) {
        this.dir = Preconditions.assertNotNull(dir, "dir");
        this.port = Preconditions.assertNotNull(port, "port");
        this.host = "127.0.0.1";
    }

}

export class WebserverConfigs {

    public static create(config: IWebserverConfig): WebserverConfig {

        const host = config.host || '127.0.0.1';

        const template = {
            host
        };

        return Object.assign(config, template);

    }

}

export interface SSLConfig {
    key: string | Buffer;
    cert: string | Buffer;
}

export interface IWebserverConfig {

    readonly dir: string;

    readonly port: number;

    /**
     * The host address to use. Defaults to 127.0.0.1
     */
    readonly host?: string;

    /**
     * When true, use SSL. Otherwise just use HTTP.
     */
    readonly useSSL?: boolean;

    readonly ssl?: SSLConfig;

    /**
     * Keeps track of URL rewrites that can be used within the app so that
     * URLs can properly load.
     */
    readonly rewrites?: ReadonlyArray<Rewrite>;

}

