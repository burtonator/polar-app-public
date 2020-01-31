import fs from "fs";
import JSZip from "jszip";
import {PathStr} from "polar-shared/src/util/Strings";
import {AbstractPHZWriter} from "./AbstractPHZWriter";

/**
 * Write to a new zip output stream.
 */
export class PHZWriter extends AbstractPHZWriter {

    private stream: fs.WriteStream;

    constructor(private readonly output: PathStr | fs.WriteStream) {

        super();

        if (typeof this.output === 'string') {
            this.stream = fs.createWriteStream(<string>output);
        } else {
            this.stream = <fs.WriteStream> output;
        }

    }

    /**
     * Save the new zip file to disk.
     */
    public async close(): Promise<void> {

        super.close();

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
