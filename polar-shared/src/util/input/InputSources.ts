import {InputSource, InputSourceType, InputSourceValue} from './InputSource';
import {URLs} from '../URLs';
import {Files} from '../Files';

export class InputSources {

    /**
     * Look at the value and and use the right constructor.
     */
    public static async ofValue(value: InputSourceValue, basename?: string): Promise<InputSource> {

        if (typeof value === 'string') {

            if (URLs.isURL(value)) {
                const response = await fetch(value);
                const blob = await response.blob();
                return this.ofBlob(blob, basename);
            }

            // this is a file path not a URL or a blob URL so open it as a file
            return this.ofStream(Files.createReadStream(value), basename);

        }

        if (value instanceof File) {
            return this.ofFile(value, basename);
        }

        if (value instanceof Blob) {
            return this.ofBlob(value, basename);
        }

        if (value instanceof Buffer) {
            return this.ofBuffer(value, basename);
        }

        // must be a readable stream
        return this.ofStream(<NodeJS.ReadableStream> value, basename);

    }


    public static ofBuffer(buffer: Buffer, basename?: string): InputSource {
        return this.of('buffer', buffer, basename);
    }

    public static ofStream(stream: NodeJS.ReadableStream, basename?: string): InputSource {
        return this.of('stream', stream, basename);
    }

    public static ofBlob(blob: Blob, basename?: string): InputSource {
        return this.of('blob', blob, basename);
    }

    public static ofFile(file: File, basename?: string): InputSource {
        return this.of('file', file, basename);
    }

    public static of(type: InputSourceType,
                     value: InputSourceValue,
                     basename?: string): InputSource {

        return { type, value, basename };

    }

    public static open(inputSource: InputSource,
                       inputListener: InputListener) {

        switch (inputSource.type) {

            case 'blob':
                this.openBlobOrFile(<Blob> inputSource.value, inputListener);
                break;

            case 'file':
                this.openBlobOrFile(<File> inputSource.value, inputListener);
                break;

            case 'stream':
                this.openStream(<NodeJS.ReadableStream> inputSource.value, inputListener);
                break;

            case 'buffer':
                this.openBuffer(<Buffer> inputSource.value, inputListener);
                break;

        }

    }

    private static openBuffer(buffer: Buffer,
                              inputListener: InputListener) {

        inputListener(buffer.buffer, undefined);
        inputListener(undefined, undefined);

    }

    private static openBlobOrFile(blob: Blob | File,
                                  inputListener: InputListener) {

        const reader = new FileReader();

        reader.onload = () => {
            inputListener(reader.result!, undefined);
            inputListener(undefined, undefined);
        };

        reader.onerror = () => {
            inputListener(undefined, reader.error!);
        };

        reader.onabort = () => {
            inputListener(undefined, reader.error!);
        };

        reader.readAsBinaryString(blob);

    }

    private static openStream(readableStream: NodeJS.ReadableStream,
                              inputListener: InputListener) {

        readableStream.on('end', chunk => {
            inputListener(chunk, undefined);
            inputListener(undefined, undefined);
        });

        readableStream.on('error', err => {
            inputListener(undefined, err);
        });

        // data resumes the paused stream so end/error have to be added
        // first.
        readableStream.on('data', chunk => {
            inputListener(chunk, undefined);
        });

    }

}

/**
 * @param data The data that's being read or undefined when we are at the end
 *     of the stream.
 * @param err An error raised while reading the data or undefined if none
 *     raised.
 */
export type InputListener = (data: InputData | undefined, err: Error | undefined) => void;

export type InputData = string | number[] | ArrayBuffer | Uint8Array;
