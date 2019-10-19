import fs from "fs";
import JSZip from "jszip";
import {Resources} from "./Resources";
import {Resource} from "./Resource";
import {ContentTypes} from "./ContentTypes";
import {ResourceEntry} from "./ResourceEntry";
import {PathStr} from "polar-shared/src/util/Strings";
import {PHZWritable} from "./PHZWritable";

/**
 * Write to a new zip output stream.
 */
export class PHZWriter implements PHZWritable {

    private stream: fs.WriteStream;

    public zip: JSZip;

    public resources: Resources;

    constructor(private readonly output: PathStr | fs.WriteStream) {

        if (typeof this.output === 'string') {
            this.stream = fs.createWriteStream(<string>output);
        } else {
            this.stream = <fs.WriteStream>output;
        }

        this.zip = new JSZip();
        this.resources = new Resources();
    }

    /**
     * Write user provided metadata which applies to all files in the archive.
     *
     */
    public async writeMetadata(metadata: any): Promise<PHZWriter> {
        this.__write("metadata.json", JSON.stringify(metadata, null, "  "), "metadata");
        return this;
    }

    /**
     *
     */
    public async writeResource(resource: Resource, content: string, comment?: string): Promise<PHZWriter> {

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

        return this;

    }

    public __writeResources() {
        this.__write("resources.json", JSON.stringify(this.resources, null, "  "), "resources");
        return this;
    }

    public __write(path: string, content: string, comment: string) {

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

        return new Promise((resolve, reject) => {

            // TODO: to convert to a blob we can specify a 'target' in the
            // constructor which could be a function callback with a blob
            // parameter.  We then handle this natively here and then write
            // the blob directly to firebase.
            //
            // this.zip.generateAsync()

            const options: JSZip.JSZipGeneratorOptions<'nodebuffer'> = {
                type: 'nodebuffer',
                streamFiles: true,
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            };

            this.zip.generateNodeStream(options)
                .pipe(this.stream)
                .on('error', function (err: Error) {
                    reject(err);
                })
                .on('finish', function () {
                    resolve();
                });

        });

    }

}
