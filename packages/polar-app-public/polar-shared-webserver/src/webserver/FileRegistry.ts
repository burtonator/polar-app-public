import {Preconditions} from 'polar-shared/src/Preconditions';
import {WebserverConfig} from './WebserverConfig';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';

import path from 'path';

/**
 * A registry of binary / local files to serve via HTTP so that pdf.js and
 * other apps can be served via URLs.
 */
export class FileRegistry {

    private readonly webserverConfig: WebserverConfig;

    /**
     * The registry of hashcodes to the file path it should be served from.
     *
     */
    private readonly registry: {[key: string]: string} = {};

    constructor(webserverConfig: WebserverConfig) {

        this.webserverConfig = Preconditions.assertNotNull(webserverConfig);

    }

    public registerFile(filename: string) {
        const key = Hashcodes.create(filename);
        return this.register(key, filename);
    }

    /**
     * Register a file to be served with the given checksum.  Then return
     * metadata about what we registered including how to fetch the file we
     * registered.
     *
     */
    public register(key: string, filename: string): RegisterEntry {

        filename = path.resolve(filename);

        const reqPath = "/files/" + key;
        this.registry[key] = filename;

        // log.info(`Registered new file at: ${reqPath} to ${filename}`);

        const scheme = this.webserverConfig.useSSL ? 'https' : 'http';

        const url = `${scheme}://${this.webserverConfig.host}:${this.webserverConfig.port}${reqPath}`;

        const result = {key, filename, url};

        // log.debug("Using file registry entry: ", result);

        return result;

    }

    /**
     * Return true if the given hashcode is registered.
     *
     * @param key The key we should fetch.
     */
    public hasKey(key: string) {
        return key in this.registry;
    }

    /**
     * Get metadata about the given key.
     *
     */
    public get(key: string): FileEntry {

        if (!this.hasKey(key)) {
            throw new Error("Key not registered: " + key);
        }

        return {
            key,
            filename: this.registry[key]
        };

    }

}

export interface FileEntry {
    readonly key: string;
    readonly filename: string;

}

export interface RegisterEntry extends FileEntry {
    readonly url: string;
}
