/**
 * The internal resource entry for this Resource.
 */
import {Resource} from './Resource';

export class ResourceEntry {

    /**
     * Unique ID representing this resource in this archive.
     *
     */
    public id: string;

    /**
     * The internal file path to this resources.
     *
     * @type {String}
     */
    public path: string;

    /**
     *
     *
     * @type {Resource}
     */
    public resource: Resource;

    constructor(opts: any) {

        this.id = opts.id;
        this.path = opts.path;
        this.resource = opts.resource;

        Object.assign(this, opts);

    }

}
