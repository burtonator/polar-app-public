import JSZip from "jszip";
import {Resources} from "./Resources";
import {Resource} from "./Resource";
import {ContentTypes} from "./ContentTypes";
import {ResourceEntry} from "./ResourceEntry";
import {PHZWritable} from "./PHZWritable";

/**
 * Write to a new zip output stream.
 */
export class AbstractPHZWriter implements PHZWritable {

    protected readonly zip: JSZip;

    protected readonly resources: Resources;

    protected constructor() {

        this.zip = new JSZip();
        this.resources = new Resources();
    }

    /**
     * Write user provided metadata which applies to all files in the archive.
     */
    public async writeMetadata(metadata: any): Promise<void> {
        this.__write("metadata.json", JSON.stringify(metadata, null, "  "), "metadata");
    }

    public async writeResource(resource: Resource, content: string, comment?: string): Promise<void> {

        // TODO: when writing the content  update the contentLength with the
        // binary storage used to represent the data as UTF-8...

        // TODO: verify that we store the data as UTF-8

        if (comment === undefined) {
            comment = "";
        }

        const ext = ContentTypes.contentTypeToExtension(resource.contentType);
        const path = `${resource.id}.${ext}`;

        const resourceEntry = new ResourceEntry({id: resource.id, path, resource});

        // add this to the resources index.
        this.resources.entries[resource.id] = resourceEntry;

        // *** write the metadata

        this.__write(`${resource.id}-meta.json`, JSON.stringify(resource, null, "  "), "");

        // *** write the actual data

        this.__write(path, content, comment);

    }

    private __writeResources() {
        this.__write("resources.json", JSON.stringify(this.resources, null, "  "), "resources");
        return this;
    }

    private __write(path: string, content: string, comment: string) {

        // FIXME: comment and how do I handle binary data??

        this.zip.file(path, content);

        return this;
    }

    /**
     * Save the new zip file to disk.
     * @return {Promise<void>}
     */
    public async close(): Promise<void> {

        this.__writeResources();

    }

}
