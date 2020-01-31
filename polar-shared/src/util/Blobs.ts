import * as stream from 'stream';
import {Logger} from "../logger/Logger";
import { ArrayBuffers } from './ArrayBuffers';

const log = Logger.create();

export class Blobs {

    public static async toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {

        return new Promise<ArrayBuffer>((resolve, reject) => {

            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                // reader.result contains the contents of blob as a typed array
                resolve(<ArrayBuffer> reader.result);
            });

            reader.addEventListener("error", (err) => {
                // reader.result contains the contents of blob as a typed array
                reject(err);
            });

            reader.readAsArrayBuffer(blob);

        });

    }

    public static async toText(blob: Blob): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                // reader.result contains the contents of blob as a typed array
                resolve(<string> reader.result);
            });

            reader.addEventListener("error", (err) => {
                // reader.result contains the contents of blob as a typed array
                reject(err);
            });

            reader.readAsText(blob);

        });

    }



    public static toStream(blob: Blob): NodeJS.ReadableStream {

        const passThrough = new stream.PassThrough();

        const writeSize = 4096;

        let error: Error | undefined;

        let index: number = 0;

        passThrough.on('error', err => {
            // the reader had a problem and we need to stop pushing data.
            error = err;
        });

        passThrough.on('drain', err => {
            doPush();
        });

        const computeEnd = () => {

            let result = index + writeSize;
            if (result > blob.size) {
                // truncate the end.
                result = blob.size;
            }

            return result;

        };

        const pushAsync = async () => {

            while (true) {

                if (error) {
                    break;
                }

                const end = computeEnd();
                const slice = blob.slice(index, end);

                const arrayBuffer = await Blobs.toArrayBuffer(slice);
                const buff = ArrayBuffers.toBuffer(arrayBuffer);

                const doNextRead = passThrough.write(buff);

                index = end;

                if (index >= blob.size) {
                    // we're done reading the document now.
                    passThrough.write(null);
                    return;
                } else if (! doNextRead) {
                    return;
                }

            }

        };

        const doPush = () => {
            pushAsync()
                .catch(err => {
                    // we had an issue pushing data so notify the reader
                    log.error("Unable to stream data: ", err);
                    passThrough.emit('error', err);
                });
        };

        doPush();

        return passThrough;

    }

}
