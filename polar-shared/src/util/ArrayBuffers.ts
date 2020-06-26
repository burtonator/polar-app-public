import {Uint8Arrays} from "./Uint8Arrays";

export namespace ArrayBuffers {

    export function toBuffer(arrayBuffer: ArrayBuffer) {
        return Buffer.from(arrayBuffer);
    }

    export function toBlob(arrayBuffer: ArrayBuffer): Blob {
        return new Blob([new Uint8Array(arrayBuffer)]);
    }

    export function toBase64(arrayBuffer: ArrayBuffer) {
        const bytes = new Uint8Array( arrayBuffer );
        return Uint8Arrays.toBase64(bytes);

    }

}

