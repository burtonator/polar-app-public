import {Logger} from "../logger/Logger";
import {Base64} from "./Base64";
import {ArrayBuffers} from "./ArrayBuffers";
import {ImageType} from "./ImageType";

const log = Logger.create();

export type DataURL = string;

export interface DecodedDataURL {

    /**
     * The actual binary data of the data URL
     */
    readonly data: ArrayBuffer;

    /**
     * The media type of the Data URL.
     *
     * Example: image/png, image/jpeg, etc.
     */
    readonly type: string;

}

/**
 * Represents an data: URL as a string.
 */
export namespace DataURLs {

    export function decode(dataURL: DataURL): DecodedDataURL {

        try {

            // data:[<media type>][;base64],<data>

            // example:
            //
            //   data:image/png;base64,iVBOR

            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code
            // that does this

            const dataPortion = parseDataPortion(dataURL);

            const byteString = Base64.atob(dataPortion);

            // separate out the mime component
            const type = dataURL.substring(dataURL.indexOf(":") + 1, dataURL.indexOf(";"));

            // write the bytes of the string to an ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);

            // create a view into the buffer
            const ia = new Uint8Array(ab);

            // set the bytes of the buffer to the correct values
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            return { data: ab, type };
        } catch (e) {
            log.warn("Unable to decode data URL: ", dataURL);
            throw e;
        }

    }

    export function encode(ab: ArrayBuffer,
                           type: ImageType) {

        const encoded = ArrayBuffers.toBase64(ab);

        return `data:${type};base64,` + encoded;

    }

    export function parseDataPortion(dataURL: DataURL) {
        return dataURL.substring(dataURL.indexOf(",") + 1);
    }

    export function toBlob(data: DataURL): Blob {

        const decoded = decode(data);

        return new Blob([decoded.data], {type: decoded.type});

    }

}

